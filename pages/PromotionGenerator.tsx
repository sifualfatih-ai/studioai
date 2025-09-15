
import React, { useState, useCallback } from 'react';
import { VIBES, STORYBOARD_PROMPTS } from '../constants';
import type { Vibe } from '../types';
import { FileInput } from '../components/FileInput';
import { VibeButton } from '../components/VibeButton';
import { Placeholder } from '../components/Placeholder';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateStoryboardFrame, fileToBase64, generateVideoFromImage } from '../services/geminiService';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

type VideoStatus = 'idle' | 'loading' | 'done' | 'error';

export default function PromotionGenerator(): React.ReactElement {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);

  const [description, setDescription] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<Vibe>(VIBES[0]);
  const [storyboard, setStoryboard] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [videoGenerationStatus, setVideoGenerationStatus] = useState<Record<number, VideoStatus>>({});
  const [generatedVideos, setGeneratedVideos] = useState<Record<number, string>>({});
  const [videoError, setVideoError] = useState<string | null>(null);


  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>, previewSetter: React.Dispatch<React.SetStateAction<string | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!productImage || !description || !selectedVibe) {
      setError('Harap unggah foto produk, isi deskripsi, dan pilih vibe.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStoryboard([]);
    setGeneratedVideos({});
    setVideoGenerationStatus({});
    setVideoError(null);

    try {
      const productBase64 = await fileToBase64(productImage);
      const faceBase64 = faceImage ? await fileToBase64(faceImage) : null;
      
      const generatedFrames: string[] = [];

      for (const framePrompt of STORYBOARD_PROMPTS) {
        const fullPrompt = framePrompt
            .replace('{description}', description)
            .replace('{vibe}', selectedVibe.name);
            
        const result = await generateStoryboardFrame(fullPrompt, productBase64, faceBase64);
        generatedFrames.push(result);
        setStoryboard([...generatedFrames]); // Update progress visually
      }

    } catch (e) {
      console.error(e);
      setError('Gagal membuat storyboard. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, faceImage, description, selectedVibe]);

  const handleGenerateVideo = useCallback(async (frameIndex: number, imageBase64: string) => {
    setVideoGenerationStatus(prev => ({ ...prev, [frameIndex]: 'loading' }));
    setVideoError(null);
    try {
        const videoUrl = await generateVideoFromImage(imageBase64);
        setGeneratedVideos(prev => ({ ...prev, [frameIndex]: videoUrl }));
        setVideoGenerationStatus(prev => ({ ...prev, [frameIndex]: 'done' }));
    } catch (e) {
        console.error(e);
        setVideoError(`Gagal membuat video untuk frame ${frameIndex + 1}.`);
        setVideoGenerationStatus(prev => ({ ...prev, [frameIndex]: 'error' }));
    }
  }, []);


  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Promosi App
            </h1>
            <p className="text-slate-400 mt-2">
              Buat storyboard, visual, dan video review produk secara otomatis.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel: Inputs */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <div className="bg-slate-800 p-6 rounded-xl space-y-6 shadow-lg">
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-purple-300">1. Unggah Aset</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FileInput 
                      id="product-photo" 
                      label="Foto Produk" 
                      onChange={handleFileChange(setProductImage, setProductImagePreview)}
                      previewUrl={productImagePreview}
                    />
                    <FileInput 
                      id="face-photo" 
                      label="Foto Wajah" 
                      onChange={handleFileChange(setFaceImage, setFaceImagePreview)}
                      previewUrl={faceImagePreview}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3 text-purple-300">2. Deskripsi Produk</h2>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Facewash dengan ekstrak teh hijau..."
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-3 text-gray-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  ></textarea>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3 text-purple-300">3. Vibe Latar Belakang</h2>
                  <div className="flex flex-wrap gap-2">
                    {VIBES.map((vibe) => (
                      <VibeButton
                        key={vibe.id}
                        vibe={vibe}
                        isSelected={selectedVibe.id === vibe.id}
                        onClick={() => setSelectedVibe(vibe)}
                      />
                    ))}
                  </div>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full text-white font-bold py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  {isLoading ? <LoadingSpinner /> : 'Generate Konten'}
                </button>
              </div>
            </div>

            {/* Right Panel: Output */}
            <div className="w-full lg:w-2/3">
              <div className="bg-slate-800 p-6 rounded-xl min-h-[60vh] shadow-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-purple-300">Hasil Storyboard</h2>
                <div className="flex-grow">
                  {isLoading && storyboard.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <LoadingSpinner size="lg" />
                      <p className="mt-4">AI sedang meracik storyboard untukmu...</p>
                    </div>
                  )}
                  {!isLoading && storyboard.length === 0 && <Placeholder />}

                  {storyboard.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                       {storyboard.map((frame, index) => {
                           const videoStatus = videoGenerationStatus[index] || 'idle';
                           const videoUrl = generatedVideos[index];
                           const buttonText = {
                              idle: 'Generate Video',
                              loading: 'Membuat Video...',
                              done: 'Video Siap',
                              error: 'Coba Lagi'
                           }[videoStatus];

                           return(
                           <div key={index} className="flex flex-col gap-2">
                               <div className="group relative bg-slate-700 rounded-lg overflow-hidden aspect-[9/16] shadow-md animate-fade-in">
                                   {videoUrl ? (
                                      <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                   ) : (
                                      <img src={frame} alt={`Storyboard frame ${index + 1}`} className="w-full h-full object-cover" />
                                   )}
                                   {!videoUrl && (
                                       <a
                                           href={frame}
                                           download={`nafsgen-frame-${index + 1}.png`}
                                           className="absolute bottom-2 right-2 bg-black bg-opacity-60 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100 hover:bg-opacity-80"
                                           aria-label={`Unduh frame ${index + 1}`}
                                           title={`Unduh frame ${index + 1}`}
                                       >
                                           <DownloadIcon />
                                       </a>
                                   )}
                               </div>
                               <button
                                 onClick={() => handleGenerateVideo(index, frame)}
                                 disabled={videoStatus === 'loading' || videoStatus === 'done'}
                                 className="w-full text-sm text-white font-semibold py-2 px-3 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                               >
                                 {videoStatus === 'loading' ? <LoadingSpinner size="sm" /> : null}
                                 <span className={videoStatus === 'loading' ? 'ml-2' : ''}>{buttonText}</span>
                               </button>
                           </div>
                       )})}
                       
                       {Array.from({ length: Math.max(0, 6 - storyboard.length) }).map((_, index) => (
                         <div key={`loader-${index}`} className="bg-slate-700 rounded-lg aspect-[9/16] flex items-center justify-center animate-pulse">
                           <LoadingSpinner />
                         </div>
                       ))}
                     </div>
                   )}
                   {videoError && <p className="text-red-400 text-sm text-center mt-4">{videoError}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
