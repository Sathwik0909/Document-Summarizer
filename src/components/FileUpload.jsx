import { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

export default function FileUpload({ onFileSelect, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file =>
      file.type === 'application/pdf' || file.type.startsWith('image/')
    );

    if (validFile) {
      onFileSelect(validFile);
    } else {
      alert('Please upload a PDF or image file');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragging
          ? 'border-blue-500 bg-blue-50 scale-105'
          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Upload className="w-12 h-12 text-gray-400" />
        </div>

        <div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragging ? 'Drop your file here' : 'Upload Document'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop or click to browse
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              <span>Images</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
