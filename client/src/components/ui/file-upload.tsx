import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "./button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  currentFile?: string;
  onClear?: () => void;
}

export function FileUpload({
  onFileSelect,
  accept = "image/*,.glb",
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
  currentFile,
  onClear,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }
    
    const allowedTypes = accept.split(',').map(type => type.trim());
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.startsWith(type.replace('*', ''));
    });
    
    if (!isValidType) {
      setError('File type not supported');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer",
          isDragOver && !disabled
            ? "border-primary bg-primary/5"
            : "border-slate-300 hover:border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-300 bg-red-50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
        <p className="text-slate-600 mb-2">
          Drag & drop a file, or click to browse
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
        >
          Choose File
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {currentFile && (
        <div className="mt-3 flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm text-slate-700 truncate">
            {currentFile}
          </span>
          {onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-4 h-4 bg-amber-500 rounded"></div>
          <span className="text-sm font-medium text-amber-800">3D Model Support</span>
        </div>
        <p className="text-xs text-amber-700">
          Upload .glb files to showcase your dishes in 3D!
        </p>
      </div>
    </div>
  );
}
