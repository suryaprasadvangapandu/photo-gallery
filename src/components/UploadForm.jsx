import React, { useState, useCallback } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UploadForm = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        setError('');

        if (!file) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setError('File size should be less than 5MB');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        setIsUploading(true);

        try {
            // Here you would typically upload the file to your server
            // For now, we'll simulate an upload with a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newPhoto = {
                id: Date.now(),
                title: title.trim(),
                url: preview,
                tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            };

            onUpload(newPhoto);

            // Reset form
            setSelectedFile(null);
            setPreview(null);
            setTitle('');
            setTags('');
            setError('');
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, title, tags, preview, onUpload]);

    const handleRemoveFile = useCallback(() => {
        setSelectedFile(null);
        setPreview(null);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload New Photo</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                            {preview ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        JPEG, PNG, GIF or WebP (MAX. 5MB)
                                    </p>
                                </div>
                            )}
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter photo title"
                        />
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label
                            htmlFor="tags"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="nature, landscape, sunset"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                </button>
            </form>
        </div>
    );
};

export default React.memo(UploadForm); 