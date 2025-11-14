import { useState } from 'react';
import { FileText, List, Maximize2 } from 'lucide-react';

export default function SummaryDisplay({ summary, fileName }) {
  const [selectedLength, setSelectedLength] = useState('medium');

  const lengths = [
    { id: 'short', label: 'Short', description: '2-3 sentences' },
    { id: 'medium', label: 'Medium', description: '1 paragraph' },
    { id: 'long', label: 'Long', description: '2-3 paragraphs' },
  ];

  const summaryText = summary[`summary_${selectedLength}`];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document Summary</h2>
          </div>
          <p className="text-sm text-gray-600">{fileName}</p>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            {lengths.map((length) => (
              <button
                key={length.id}
                onClick={() => setSelectedLength(length.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedLength === length.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {length.label}
              </button>
            ))}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {summaryText}
            </p>
          </div>
        </div>
      </div>

      {summary.key_points && summary.key_points.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Key Points</h3>
            </div>
          </div>

          <div className="p-6">
            <ul className="space-y-3">
              {summary.key_points.map((point, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {summary.extracted_text && (
        <details className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 inline">
                View Full Extracted Text
              </h3>
            </div>
          </summary>
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {summary.extracted_text}
            </pre>
          </div>
        </details>
      )}
    </div>
  );
}
