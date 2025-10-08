import { ChangeEvent, useState, useRef } from 'react';
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import prettyBytes from 'pretty-bytes';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect: (file: File | null) => void;
  label?: string;
  error?: string;
  value?: File | null;
}

export default function FileUpload({
  accept = '*/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  label,
  error,
  value,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    // Check file size
    if (file.size > maxSize) {
      const errorMsg = `El archivo es demasiado grande. El tamaño máximo es ${prettyBytes(maxSize)}.`;
      setFileError(errorMsg);
      return false;
    }

    // Check file type if accept is provided and not wildcard
    if (accept !== '*/*') {
      const fileType = file.type;
      const acceptedTypes = accept.split(',').map(type => type.trim());
      
      const isAccepted = acceptedTypes.some(type => {
        // Handle wildcard mime types like image/*
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(`${category}/`);
        }
        return type === fileType;
      });

      if (!isAccepted) {
        setFileError('Tipo de archivo no aceptado.');
        return false;
      }
    }

    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        onFileSelect(file);
      } else {
        // If validation failed, clear the input
        e.target.value = '';
        onFileSelect(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        onFileSelect(file);
        if (inputRef.current) {
          inputRef.current.files = e.dataTransfer.files;
        }
      }
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    setFileError(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-4
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'}
          ${error || fileError ? 'border-red-500' : ''}
          ${value ? 'bg-gray-700/50' : ''}
          hover:bg-gray-700/30 transition-colors duration-200 cursor-pointer
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleChange}
          accept={accept}
        />

{value ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">{value.name}</p>
                <p className="text-xs text-gray-400">
                  {prettyBytes(value.size)} • {value.type}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600
                text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-white">
              Arrastra y suelta un archivo aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Tamaño máximo: {prettyBytes(maxSize)}
              {accept !== '*/*' && ` • Formatos: ${accept}`}
            </p>
          </div>
        )}
      </div>
      
      {(error || fileError) && (
        <p className="mt-1 text-sm text-red-500">
          {error || fileError}
        </p>
      )}
    </div>
  );
}