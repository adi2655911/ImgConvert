'use client';
import { useState } from 'react';
import axios from 'axios';
import ConvertedImages from './ConvertedImages';

const formats = ['jpeg', 'png', 'webp', 'gif'];

export default function ConverterForm() {
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('png');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('px');
  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setResults([]);
    setError('');
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('outputFormat', outputFormat);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('unit', unit);
    formData.append('quality', quality);

try {
  setLoading(true);
  const res = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  setResults(res.data.results);
} catch (err) {
  console.error('Upload error:', err);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-xl text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Image Format Converter</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-purple-600 file:text-white
        hover:file:bg-purple-700 mb-4"
      />

      <div className="mb-4">
        <label className="block mb-1 font-medium">Convert to Format:</label>
        <select
          value={outputFormat}
          onChange={e => setOutputFormat(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          {formats.map(f => (
            <option key={f} value={f}>{f.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Quality: {quality}</label>
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={e => setQuality(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Width</label>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(e.target.value)}
            placeholder="e.g. 800"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Height</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="e.g. 600"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Unit</label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="px">Pixels</option>
            <option value="cm">Centimeters</option>
            <option value="in">Inches</option>
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 font-medium mb-4">{error}</div>}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded font-semibold"
      >
        {loading ? 'Converting...' : 'Convert Images'}
      </button>

      {results.length > 0 && <ConvertedImages results={results} />}
    </div>
  );
}