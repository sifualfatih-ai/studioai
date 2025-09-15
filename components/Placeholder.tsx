import React from 'react';

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);


export const Placeholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
      <ImageIcon />
      <p className="mt-4 text-lg">Hasil konten Anda akan muncul di sini.</p>
      <p className="text-sm">Isi form di sebelah kiri dan klik generate.</p>
    </div>
  );
};
