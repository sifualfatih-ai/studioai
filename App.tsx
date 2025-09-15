import React, { useState } from 'react';

// Import the actual page components to fix the "empty page" issue
import PromotionGenerator from './pages/PromotionGenerator';
import AudioGenerator from './pages/AudioGenerator';
import VideoGenerator from './pages/VideoGenerator';
import ImageGenerator from './pages/ImageGenerator';

const SidebarIcon = ({ children, active = false, onClick }: { children: React.ReactNode, active?: boolean, onClick?: () => void }) => (
    <div onClick={onClick} className={`relative flex items-center justify-center h-12 w-12 my-2 mx-auto shadow-lg rounded-3xl transition-all duration-300 ease-linear cursor-pointer group ${active ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl' : 'bg-slate-700 text-purple-400 hover:bg-purple-600 hover:text-white hover:rounded-xl'}`}>
        {children}
    </div>
);

const App: React.FC = () => {
    const [activePage, setActivePage] = useState('promotion');

    // A simple router-like mechanism that now renders the full components
    const renderPage = () => {
        switch (activePage) {
            case 'promotion': return <PromotionGenerator />;
            case 'audio': return <AudioGenerator />;
            case 'video': return <VideoGenerator />;
            case 'image': return <ImageGenerator />;
            default: return <PromotionGenerator />;
        }
    };

    return (
        <div className="flex bg-slate-900 text-white min-h-screen font-sans">
            <nav className="fixed top-0 left-0 h-screen w-20 flex flex-col bg-slate-800 shadow-lg z-10">
                <a href="https://nafsflow.com" target="_blank" rel="noopener noreferrer">
                    <div className="relative flex items-center justify-center h-12 w-12 mt-4 mb-2 mx-auto bg-slate-700 text-purple-400 font-bold text-xl rounded-xl">
                        NF
                    </div>
                </a>
                <div className="flex-grow">
                    <SidebarIcon active={activePage === 'promotion'} onClick={() => setActivePage('promotion')}>
                         {/* Promosi App Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </SidebarIcon>
                    <SidebarIcon active={activePage === 'audio'} onClick={() => setActivePage('audio')}>
                        {/* Audio AI Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </SidebarIcon>
                    <SidebarIcon active={activePage === 'video'} onClick={() => setActivePage('video')}>
                        {/* Generate Video Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </SidebarIcon>
                    <SidebarIcon active={activePage === 'image'} onClick={() => setActivePage('image')}>
                        {/* Generate Image Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </SidebarIcon>
                </div>
                <div className="mb-4">
                    <SidebarIcon>
                        {/* User/Login Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </SidebarIcon>
                </div>
            </nav>
            <main className="ml-20 flex-grow">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;