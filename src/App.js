import React, { useState } from 'react';
import { photos } from './data/photos';
import ImageCard from './components/ImageCard';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = photos.filter((photo) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      photo.title.toLowerCase().includes(searchLower) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Photo Gallery</h1>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <ImageCard
              key={photo.id}
              photo={photo}
              onClick={setSelectedPhoto}
            />
          ))}
        </div>
      </div>
      <Modal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}

export default App;
