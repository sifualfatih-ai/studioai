import React, { useState, useCallback } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FileInput } from '../components/FileInput';
import { generateVideo, fileToBase64 } from '../services/geminiService';
import { VIDEO_MODELS, ASPECT_RATIOS } from '../constants';
import type { VideoModel, AspectRatio } from '../types';

const VideoIconPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export default function VideoGenerator(): React.ReactElement {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<VideoModel>('VEO 2.0');
    const [prompt, setPrompt] = useState('');
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('9:16');
    const [duration, setDuration] = useState<number>(8);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');

    const loadingMessages = [
        "Mempersiapkan mesin video AI...",
        "Mengumpulkan piksel dari galaksi digital...",
        "Mengajari AI cara membuat film...",
        "Ini mungkin memakan waktu beberapa menit. Sabar ya...",
        "Hampir selesai, sentuhan akhir sedang diterapkan...",
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Prompt tidak boleh kosong.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        let messageIndex = 0;
        setLoadingMessage(loadingMessages[messageIndex]);
        const intervalId = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 5000);

        try {
            const imageBase64 = imageFile ? await fileToBase64(imageFile) : null;
            const resultUrl = await generateVideo({
                prompt,
                model: selectedModel,
                aspectRatio: selectedAspectRatio,
                duration,
                imageBase64,
            });
            setVideoUrl(resultUrl);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Gagal membuat video. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
            clearInterval(intervalId);
            setLoadingMessage('');
        }
    }, [prompt, imageFile, selectedModel, selectedAspectRatio, duration, loadingMessages]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full">
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
                    Generate Video
                </h1>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100%-80px)]">
                {/* Left Panel: Inputs */}
                <div className="w-full lg:w-1/3 flex-shrink-0">
                    <div className="bg-slate-800 p-6 rounded-xl space-y-5 shadow-lg h-full overflow-y-auto">
                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">Gambar Referensi (Opsional)</label>
                          <FileInput id="video-ref-image" label="Klik untuk unggah" onChange={handleFileChange} previewUrl={imagePreview} />
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Model</label>
                            <div className="grid grid-cols-2 gap-2">
                                {VIDEO_MODELS.map(model => (
                                    <button key={model} onClick={() => setSelectedModel(model)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${selectedModel === model ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                        {model}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="prompt" className="text-sm font-medium text-slate-300 mb-2 block">Prompt</label>
                            <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="A neon hologram of a cat driving..." className="w-full h-28 bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none"></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Aspect Ratio</label>
                                 <div className="grid grid-cols-2 gap-2">
                                    {ASPECT_RATIOS.map(ratio => (
                                        <button key={ratio} onClick={() => setSelectedAspectRatio(ratio)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${selectedAspectRatio === ratio ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label htmlFor="duration" className="text-sm font-medium text-slate-300 mb-2 block">Durasi</label>
                                <select id="duration" value={duration} onChange={e => setDuration(parseInt(e.target.value, 10))} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200">
                                    <option value={8}>8 detik</option>
                                </select>
                            </div>
                        </div>
                        
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button onClick={handleGenerate} disabled={isLoading} className="w-full text-slate-800 font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg">
                            {isLoading ? <LoadingSpinner /> : 'Generate Video'}
                        </button>
                        <button disabled className="w-full text-slate-400 text-sm font-medium py-2 px-4 rounded-lg bg-slate-700/50 flex items-center justify-center gap-2 cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                            Login untuk Generate
                        </button>
                    </div>
                </div>

                {/* Right Panel: Output */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg h-full flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 text-purple-300">Hasil</h2>
                        <div className="flex-grow flex items-center justify-center bg-slate-900 rounded-lg">
                            {isLoading ? (
                                <div className="text-center">
                                    <LoadingSpinner size="lg"/>
                                    <p className="mt-4 text-slate-400">{loadingMessage}</p>
                                </div>
                            ) : videoUrl ? (
                                <video controls autoPlay loop src={videoUrl} className="max-w-full max-h-full rounded-lg">
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-center text-slate-500">
                                    <VideoIconPlaceholder />
                                    <p className="mt-2">Hasil video Anda akan muncul di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}