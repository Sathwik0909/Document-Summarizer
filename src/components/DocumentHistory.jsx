import { useState, useEffect } from 'react';
import { FileText, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DocumentHistory({ onSelectDocument, currentDocumentId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*, summaries(*)')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Recent Documents</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className={`
              w-full p-4 text-left hover:bg-gray-50 transition-colors
              ${doc.id === currentDocumentId ? 'bg-blue-50' : ''}
            `}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.filename}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(doc.created_at)}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
