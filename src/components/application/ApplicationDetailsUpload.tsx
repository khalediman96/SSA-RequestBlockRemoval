import { useCallback, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";

type UploadedFile = {
  id: string;
  file: File;
};

let uploadKey = 0;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`;
  const kb = Math.round(bytes / 1024);
  return `${kb}kb`;
}

function isSameFile(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

export function ApplicationDetailsUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const addFiles = useCallback((list: FileList | null) => {
    if (!list?.length) return;
    const incoming = Array.from(list);
    setFiles((prev) => {
      const next = [...prev];
      for (const file of incoming) {
        if (next.some((item) => isSameFile(item.file, file))) continue;
        uploadKey += 1;
        next.push({ id: `upload-${uploadKey}`, file });
      }
      return next;
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="app-details__upload-block">
      <div
        className="app-details__upload"
        role="presentation"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <img className="app-details__upload-icon" src="/upload.svg" alt="" width={33} height={33} />
        <p className="app-details__upload-hint">Drag your files to start uploading</p>
        <span className="app-details__upload-divider">or</span>
        <button
          type="button"
          className="app-details__upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </button>
        <p className="app-details__upload-multi-hint">PDF, JPG, PNG · multiple files allowed</p>
        <input
          ref={inputRef}
          id={inputId}
          className="app-details__upload-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          multiple
          onChange={onInputChange}
        />
      </div>

      {files.length > 0 ? (
        <ul className="app-details__file-list" aria-label="Uploaded documents">
          {files.map(({ id, file }) => (
            <li key={id} className="app-details__file-card">
              <div className="app-details__file-card-top">
                <img
                  className="app-details__file-icon"
                  src="/PDF-40.svg"
                  alt=""
                  width={36}
                  height={36}
                />
                <div className="app-details__file-meta">
                  <p className="app-details__file-name">{file.name}</p>
                  <p className="app-details__file-size">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  className="app-details__file-remove"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(id)}
                >
                  <img src="/highlight_off.svg" alt="" width={24} height={24} aria-hidden="true" />
                </button>
              </div>
              <div className="app-details__file-progress">
                <div className="app-details__file-progress-track">
                  <div className="app-details__file-progress-fill" />
                </div>
                <span className="app-details__file-progress-pct">100%</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}