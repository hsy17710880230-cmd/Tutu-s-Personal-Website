import Image from "next/image";

type FilePreviewProps = {
  url: string;
  name: string;
};

export default function FilePreview({ url, name }: FilePreviewProps) {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(name);

  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 overflow-hidden rounded-lg border bg-gray-100">
        {isImage ? (
          <Image
            src={url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            FILE
          </div>
        )}
      </div>

      <span className="max-w-[200px] truncate text-sm text-gray-700">
        {name}
      </span>
    </div>
  );
}
