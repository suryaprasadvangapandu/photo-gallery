import React, { useEffect, useState, useCallback } from 'react';
import { XMarkIcon, HeartIcon, ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Modal = ({ photo, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (photo) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
      setIsLoading(true);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [photo, onClose]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
  }, [isLiked]);

  const handleShare = useCallback(() => {
    setShowShareOptions(!showShareOptions);
  }, [showShareOptions]);

  const copyToClipboard = useCallback(() => {
    if (photo?.url) {
      navigator.clipboard.writeText(photo.url);
      setShowShareOptions(false);
    }
  }, [photo?.url]);

  const downloadImage = useCallback(async () => {
    if (!photo?.url) return;

    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.title?.toLowerCase().replace(/\s+/g, '-') || 'photo'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }, [photo]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div
        className="relative max-w-4xl w-full animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="aspect-video w-full bg-gray-200 dark:bg-gray-700 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <img
              src={photo.url}
              alt={photo.title || 'Photo'}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoading(false)}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{photo.title || 'Untitled'}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label={isLiked ? "Unlike photo" : "Like photo"}
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Share photo"
                >
                  <ShareIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={downloadImage}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Download photo"
                >
                  <ArrowDownTrayIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {showShareOptions && (
              <div className="absolute bottom-20 right-6 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
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
      </div>
    </div>
  );
};

export default React.memo(Modal);