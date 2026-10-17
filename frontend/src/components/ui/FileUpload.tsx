'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { cn, formatFileSize, validateResumeFile } from '@/lib/utils';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.docx,.doc',
  disabled,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateResumeFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && !selectedFile && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-150',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500',
          isDragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-surface-border bg-surface-DEFAULT hover:border-brand-400 hover:bg-brand-50/40',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && !selectedFile && 'cursor-pointer'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          className="sr-only"
          disabled={disabled}
          tabIndex={-1}
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 w-full max-w-sm">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center">
              <File className="h-5 w-5 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{selectedFile.name}</p>
              <p className="text-xs text-ink-muted">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="h-14 w-14 rounded-2xl bg-brand-100 flex items-center justify-center">
              <Upload className="h-7 w-7 text-brand-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-ink">
                Drop your resume here, or{' '}
                <span className="text-brand-600">click to browse</span>
              </p>
              <p className="text-xs text-ink-muted mt-1">
                PDF or DOCX · Max 5 MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-start gap-2 text-red-600">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!selectedFile && (
        <div className="mt-3 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            Select File
          </Button>
        </div>
      )}
    </div>
  );
}
