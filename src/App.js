import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { photos } from './data/photos';
import ImageCard from './components/ImageCard';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import UploadForm from './components/UploadForm';
import { SunIcon, MoonIcon, PlusIcon } from '@heroicons/react/24/outline';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a dark mode preference
    return localStorage.getItem('darkMode') === 'true' ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches &&
        localStorage.getItem('darkMode') === null);
  });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState(photos);

  useEffect(() => {
    // Update localStorage and document class
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleViewAllPhotos = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handlePhotoClick = useCallback((photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleUploadPhoto = useCallback((newPhoto) => {
    setGalleryPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
    setShowUploadForm(false);
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!searchTerm.trim()) return galleryPhotos;

    const searchLower = searchTerm.toLowerCase().trim();
    return galleryPhotos.filter((photo) =>
      photo.title.toLowerCase().includes(searchLower) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }, [searchTerm, galleryPhotos]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Photo Gallery</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Upload Photo
            </button>
            <button
              onClick={handleViewAllPhotos}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              View All Photos
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {showUploadForm && (
          <div className="mb-8">
            <UploadForm onUpload={handleUploadPhoto} />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <ImageCard
              key={photo.id}
              photo={photo}
              onClick={() => handlePhotoClick(photo)}
            />
          ))}
        </div>
      </div>
      <Modal photo={selectedPhoto} onClose={handleModalClose} />
    </div>
  );
};

export default React.memo(App);
