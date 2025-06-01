'use client';

import Image from 'next/image';

export default function ConvertedImages({ results }) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Converted Images</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((res, idx) => (
          <div
            key={idx}
            className="bg-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="relative h-48 w-full bg-gray-800 flex items-center justify-center">
              <Image
                src={res.url} // this should be like '/converted/filename.png'
                alt={res.original}
                fill
                style={{ objectFit: 'contain' }}
                priority={false}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4 text-center">
              <h6 className="text-sm font-semibold truncate">{res.converted}</h6>
              <p className="text-xs text-gray-300 truncate">From: {res.original}</p>
              <a
                href={res.url} // use relative url here
                download={res.converted}
                className="mt-2 inline-block px-4 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}