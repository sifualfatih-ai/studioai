
import React, { useState, useCallback } from 'react';
import { VOICE_ACTORS, VOICE_VIBES } from '../constants';
import type { VoiceActor, VoiceVibe } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateVoiceOver } from '../services/geminiService';


const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export default function AudioGenerator(): React.ReactElement {
    const [script, setScript] = useState('');
    const [selectedActor, setSelectedActor] = useState<VoiceActor>(VOICE_ACTORS[0]);
    const [selectedVibe, setSelectedVibe] = useState<VoiceVibe>(VOICE_VIBES[0]);
    const [speed, setSpeed] = useState(1.0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!script.trim()) {
            setError('Naskah tidak boleh kosong.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAudioUrl(null);

        try {
            const resultUrl = await generateVoiceOver(script, selectedActor.id, selectedVibe.id, speed);
            setAudioUrl(resultUrl);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Gagal membuat audio. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }

    }, [script, selectedActor, selectedVibe, speed]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full">
            <div className="max-w-7xl mx-auto">
                <header className="text-left mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-100">
                        Studio Suara AI
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Ubah teks menjadi audio berkualitas tinggi dengan beragam pilihan suara.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        <div className="bg-slate-800 p-6 rounded-xl space-y-4 shadow-lg">
                             <h2 className="text-lg font-semibold text-purple-300">1. Tulis Naskah Anda</h2>
                             <textarea
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                placeholder="Ketik atau tempel naskah voice over Anda di sini..."
                                className="w-full h-48 bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none"
                              ></textarea>
                              <p className="text-right text-sm text-slate-500">{script.length} karakter</p>
                        </div>
                         <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex-grow flex flex-col">
                            <h2 className="text-lg font-semibold mb-4 text-purple-300">Hasil Voice Over</h2>
                            <div className="flex-grow flex items-center justify-center">
                                {isLoading ? (
                                    <div className="text-center">
                                        <LoadingSpinner size="lg"/>
                                        <p className="mt-4 text-slate-400">AI sedang memproses suara...</p>
                                    </div>
                                ) : audioUrl ? (
                                    <div className="w-full">
                                        <audio controls src={audioUrl} className="w-full">
                                            Your browser does not support the audio element.
                                        </audio>
                                        <a 
                                          href={audioUrl} 
                                          download="voice-over.mp3"
                                          className="block text-center w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                        >
                                          Unduh MP3
                                        </a>
                                    </div>
                                ) : (
                                     <div className="text-center text-slate-500">
                                        <MicrophoneIcon />
                                        <p className="mt-2">Hasil audio Anda akan muncul di sini.</p>
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-1/3 flex-shrink-0">
                        <div className="bg-slate-800 p-6 rounded-xl space-y-6 shadow-lg">
                            <div>
                                <h2 className="text-lg font-semibold mb-3 text-purple-300">2. Pilih Aktor Suara</h2>
                                <select 
                                    value={selectedActor.id} 
                                    onChange={e => setSelectedActor(VOICE_ACTORS.find(a => a.id === e.target.value) || VOICE_ACTORS[0])}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                                >
                                {VOICE_ACTORS.map(actor => (
                                    <option key={actor.id} value={actor.id}>{actor.name}</option>
                                ))}
                                </select>
                            </div>
                             <div>
                                <h2 className="text-lg font-semibold mb-3 text-purple-300">3. Pilih Vibe Suara</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {VOICE_VIBES.map(vibe => (
                                        <button 
                                            key={vibe.id}
                                            onClick={() => setSelectedVibe(vibe)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${selectedVibe.id === vibe.id ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                                        >
                                            {vibe.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h2 className="text-lg font-semibold mb-3 text-purple-300">4. Kontrol Kecepatan Suara ({speed.toFixed(2)}x)</h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">Lambat</span>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="1.5"
                                        step="0.05"
                                        value={speed}
                                        onChange={e => setSpeed(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <span className="text-sm text-slate-400">Cepat</span>
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            
                            <button
                              onClick={handleGenerate}
                              disabled={isLoading}
                              className="w-full text-slate-800 font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                            >
                              {isLoading ? <LoadingSpinner /> : 'Generate Voice Over'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
