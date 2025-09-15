
import React, { useState, useCallback } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateImage } from '../services/geminiService';
import { ASPECT_RATIOS } from '../constants';
import type { AspectRatio } from '../types';

const ImageIconPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);

export default function ImageGenerator(): React.ReactElement {
    const [prompt, setPrompt] = useState('');
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Prompt tidak boleh kosong.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImages([]);

        try {
            const resultUrls = await generateImage(prompt, selectedAspectRatio, numberOfImages);
            setImages(resultUrls);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Gagal membuat gambar. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, selectedAspectRatio, numberOfImages]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full">
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                    Generate Gambar
                </h1>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100%-80px)]">
                {/* Left Panel: Inputs */}
                <div className="w-full lg:w-1/3 flex-shrink-0">
                    <div className="bg-slate-800 p-6 rounded-xl space-y-6 shadow-lg h-full overflow-y-auto">
                        <div>
                            <label htmlFor="prompt" className="text-lg font-semibold text-purple-300 mb-3 block">1. Prompt</label>
                            <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A robot holding a red skateboard..." className="w-full h-36 bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none"></textarea>
                        </div>

                        <div>
                            <label className="text-lg font-semibold text-purple-300 mb-3 block">2. Aspect Ratio</label>
                            <div className="grid grid-cols-3 gap-2">
                                {ASPECT_RATIOS.map(ratio => (
                                    <button key={ratio} onClick={() => setSelectedAspectRatio(ratio)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${selectedAspectRatio === ratio ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                           <label htmlFor="numberOfImages" className="text-lg font-semibold text-purple-300 mb-3 block">3. Jumlah Gambar ({numberOfImages})</label>
                           <input
                                id="numberOfImages"
                                type="range"
                                min="1"
                                max="4"
                                step="1"
                                value={numberOfImages}
                                onChange={e => setNumberOfImages(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                        
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button onClick={handleGenerate} disabled={isLoading} className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg">
                            {isLoading ? <LoadingSpinner /> : 'Generate Gambar'}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 text-purple-300">Hasil</h2>
                        <div className="flex-grow flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden">
                            {isLoading ? (
                                <div className="text-center">
                                    <LoadingSpinner size="lg"/>
                                    <p className="mt-4 text-slate-400">AI sedang melukis...</p>
                                </div>
                            ) : images.length > 0 ? (
                                <div className={`grid gap-4 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} p-4 h-full w-full`}>
                                    {images.map((imgSrc, index) => (
                                        <div key={index} className="relative group w-full h-full flex items-center justify-center">
                                            <img src={imgSrc} alt={`Generated image ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg"/>
                                            <a href={imgSrc} download={`generated-image-${index + 1}.png`} className="absolute bottom-2 right-2 bg-black bg-opacity-60 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DownloadIcon />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-slate-500">
                                    <ImageIconPlaceholder />
                                    <p className="mt-2">Hasil gambar Anda akan muncul di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
