import React from 'react';

interface FileInputProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const FileInput: React.FC<FileInputProps> = ({ id, label, onChange, previewUrl }) => {
  return (
    <div className="relative">
      <input
        type="file"
        id={id}
        className="absolute w-0 h-0 opacity-0"
        onChange={onChange}
        accept="image/*"
      />
      <label
        htmlFor={id}
        className="group cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg hover:border-purple-500 hover:bg-slate-700 transition-all duration-300"
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="w-full h-full object-cover rounded-md" />
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="text-sm text-slate-400 mt-2">{label}</p>
          </div>
        )}
      </label>
    </div>
  );
};
