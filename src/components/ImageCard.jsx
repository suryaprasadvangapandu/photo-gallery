import React, { useState, useCallback } from 'react';
import { HeartIcon, ShareIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ImageCard = ({ photo, onClick, onDelete }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = useCallback((e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  }, [isLiked]);

  const handleShare = useCallback((e) => {
    e.stopPropagation();
    setShowShareOptions(!showShareOptions);
  }, [showShareOptions]);

  const copyToClipboard = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(photo.url);
    setShowShareOptions(false);
  }, [photo.url]);

  const handleDelete = useCallback(async (e) => {
    e.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(photo.id);
    } catch (error) {
      console.error('Error deleting photo:', error);
      // The error will be handled by the App component
    } finally {
      setIsDeleting(false);
    }
  }, [photo.id, onDelete, isDeleting]);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square relative">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        <img
          src={photo.url}
          alt={photo.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end`}
      >
        <h3 className="text-white text-lg font-semibold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {photo.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {photo.tags.map((tag) => (
            <span
              key={tag}
              className="bg-white/20 text-white text-xs px-2 py-1 rounded-full hover:bg-white/30 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            aria-label={isLiked ? "Unlike photo" : "Like photo"}
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-white" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            aria-label="Share photo"
          >
            <ShareIcon className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50"
            aria-label="Delete photo"
          >
            {isDeleting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <TrashIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 text-white text-sm">
          <EyeIcon className="h-5 w-5" />
          <span>{Math.floor(Math.random() * 1000)}</span>
        </div>

        {showShareOptions && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-b-lg shadow-lg">
            <button
              onClick={copyToClipboard}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
            >
              Copy Image URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ImageCard);