import React from 'react';

const ImageCard = ({ photo, onClick }) => {
  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg"
      onClick={() => onClick(photo)}
    >
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          src={photo.url}
          alt={photo.title}
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-semibold">{photo.title}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {photo.tags.map((tag) => (
            <span key={tag} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;