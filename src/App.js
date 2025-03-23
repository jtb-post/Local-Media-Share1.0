import React, { useState, useEffect } from 'react';
import { AlertCircle, Upload, Trash2, Play } from 'lucide-react';

const MediaStreamer = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    // Base URL for API (change to your server's address when deploying)
    const baseUrl = 'http://localhost:3000';

    // Fetch media files on component mount
    useEffect(() => {
        fetchMediaFiles();
    }, []);

    const fetchMediaFiles = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/media`);
            if (!response.ok) throw new Error('Failed to fetch media files');
            const data = await response.json();
            setMediaFiles(data);
        } catch (err) {
            setError('Error loading media files');
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('mediaFile', selectedFile);

        try {
            const response = await fetch(`${baseUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            setSelectedFile(null);
            fetchMediaFiles();
        } catch (err) {
            setError('Failed to upload file');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (filename) => {
        try {
            const response = await fetch(`${baseUrl}/api/media/${filename}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            // If we're deleting the currently playing file, stop playback
            if (currentlyPlaying && currentlyPlaying.name === filename) {
                setCurrentlyPlaying(null);
            }

            fetchMediaFiles();
        } catch (err) {
            setError('Failed to delete file');
            console.error(err);
        }
    };

    const handlePlay = (file) => {
        setCurrentlyPlaying(file);
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        else return (bytes / 1073741824).toFixed(1) + ' GB';
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-gray-300">
            <header className="bg-gray-800 p-4 text-white border-b border-gray-700">
                <h1 className="text-2xl font-bold">Local Media Streamer</h1>
            </header>

            <main className="flex flex-col md:flex-row flex-1 p-4 gap-4">
                <div className="w-full md:w-1/3 bg-gray-900 p-4 rounded shadow-md border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4 text-violet-300">Upload Media</h2>

                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Select file to upload</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:outline-none focus:border-violet-500"
                            accept="video/*,audio/*"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="w-full bg-violet-700 hover:bg-violet-600 text-white p-2 rounded flex items-center justify-center disabled:bg-gray-700"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>

                    <div className="mt-6">
                        <h3 className="font-medium mb-2 text-violet-300">Your Media Library</h3>
                        {mediaFiles.length === 0 ? (
                            <p className="text-gray-500">No media files found.</p>
                        ) : (
                            <ul className="divide-y divide-gray-800">
                                {mediaFiles.map((file) => (
                                    <li key={file.name} className="py-2 flex items-center">
                                        <div className="flex-1">
                                            <p className="font-medium truncate text-gray-200">{file.name}</p>
                                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePlay(file)}
                                                className="p-1 text-violet-400 hover:bg-gray-800 rounded"
                                                title="Play"
                                            >
                                                <Play className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.name)}
                                                className="p-1 text-red-400 hover:bg-red-900 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 bg-gray-900 p-4 rounded shadow-md border border-gray-800">
                    <h2 className="text-xl font-semibold mb-4 text-violet-300">Media Player</h2>

                    {currentlyPlaying ? (
                        <div>
                            <h3 className="font-medium mb-2 text-gray-200">Now Playing: {currentlyPlaying.name}</h3>
                            {currentlyPlaying.type === 'mp4' || currentlyPlaying.type === 'mov' || currentlyPlaying.type === 'webm' ? (
                                <video
                                    src={`${baseUrl}${currentlyPlaying.path}`}
                                    className="w-full max-h-96 bg-black rounded border border-gray-700"
                                    controls
                                    autoPlay
                                />
                            ) : (
                                <audio
                                    src={`${baseUrl}${currentlyPlaying.path}`}
                                    className="w-full bg-gray-800 rounded p-2 border border-gray-700"
                                    controls
                                    autoPlay
                                />
                            )}
                            <div className="mt-2 text-sm text-gray-400">
                                <p>File size: {formatFileSize(currentlyPlaying.size)}</p>
                                <p>Type: {currentlyPlaying.type}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-800 text-gray-500 rounded border border-gray-700">
                            <p>Select a file to play</p>
                        </div>
                    )}

                    <div className="mt-4 bg-gray-800 p-4 rounded border border-gray-700">
                        <h3 className="font-medium mb-2 text-violet-300">Streaming Information</h3>
                        <p className="text-sm text-gray-400">
                            Access your media on other devices by connecting to this server's IP address.
                            Make sure all devices are on the same network.
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            For iPhone access, open Safari and navigate to:
                            <code className="block bg-gray-950 p-2 mt-1 rounded text-violet-200 border border-gray-700">http://[your-computer-ip]:3000</code>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 p-4 text-center text-gray-400 text-sm border-t border-gray-700">
                <p>Local Media Streamer - Stream your media to any device on your network</p>
            </footer>
        </div>
    );
};

export default MediaStreamer;