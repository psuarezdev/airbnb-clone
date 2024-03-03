import { useState } from 'react';
import { BiX } from 'react-icons/bi';

const SUPPORTED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

interface FileUploadProps {
  value: string;
  onChange: (value: File | null) => void;
}

export default function ImageUpload({ value, onChange }: FileUploadProps) {
  const [file, setFile] = useState<File | string | null>(value);

  const handleOnChange = (file: File | null) => {
    setFile(file);
    onChange(file);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="flex items-center justify-center w-full">
        {!file && (
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-rose-500 border-dashed rounded-lg cursor-pointer bg-rose-500/50 hover:bg-rose-300/50 transition-colors"
            htmlFor="file">
            <p className="text-sm text-white font-semibold">
              Click to upload
            </p>
            <input
              className="hidden"
              type="file"
              id="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                file && SUPPORTED_FILE_TYPES.includes(file.type)
                  ? handleOnChange(file)
                  : handleOnChange(null);
              }}
            />
          </label>
        )}
        {file && (
          <div className="relative max-w-50 h-auto mt-1">
            <img
              className="mx-0 aspect-video object-cover"
              src={typeof file === 'string' ? file : URL.createObjectURL(file)}
              alt="Image preview"
            />
            <BiX
              className="absolute top-1 right-1 w-6 h-6 text-white bg-red-500 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleOnChange(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}