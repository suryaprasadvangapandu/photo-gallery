import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-auto rounded-lg"
        />
        <div className="mt-4 text-white">
          <h2 className="text-xl font-bold">{photo.title}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {photo.tags.map((tag) => (
              <span key={tag} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;