import { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProcessingStatus from './components/ProcessingStatus';
import SummaryDisplay from './components/SummaryDisplay';
import DocumentHistory from './components/DocumentHistory';
import { supabase } from './lib/supabase';
import { extractTextFromPDF, extractTextFromImage } from './lib/documentProcessor';
import { generateSummaries } from './lib/gemini';

export default function App() {
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentSummary, setCurrentSummary] = useState(null);
  const [error, setError] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);

  async function handleFileSelect(file) {
    setProcessing(true);
    setError(null);
    setCurrentSummary(null);
    setCurrentFile(file);
    setProgress(0);

    try {
      setProcessingStage('uploading');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: documentData, error: insertError } = await supabase
        .from('documents')
        .insert({
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setProcessingStage('extracting');
      let extractedText = '';

      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        extractedText = await extractTextFromImage(file, (progressValue) => {
          setProgress(progressValue);
        });
      } else {
        throw new Error('Unsupported file type');
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the document');
      }

      setProcessingStage('summarizing');
      setProgress(0);

      const summaries = await generateSummaries(extractedText);

      const { error: summaryError } = await supabase
        .from('summaries')
        .insert({
          document_id: documentData.id,
          extracted_text: extractedText,
          summary_short: summaries.short,
          summary_medium: summaries.medium,
          summary_long: summaries.long,
          key_points: summaries.keyPoints,
        });

      if (summaryError) throw summaryError;

      await supabase
        .from('documents')
        .update({ status: 'completed' })
        .eq('id', documentData.id);

      setProcessingStage('complete');

      const { data: summaryData } = await supabase
        .from('summaries')
        .select('*')
        .eq('document_id', documentData.id)
        .single();

      setCurrentSummary(summaryData);
      setHistoryKey(prev => prev + 1);

    } catch (err) {
      console.error('Error processing document:', err);
      setError(err.message || 'Failed to process document. Please try again.');
    } finally {
      setProcessing(false);
      setProcessingStage('');
      setProgress(0);
    }
  }

  async function handleSelectDocument(doc) {
    if (doc.summaries && doc.summaries.length > 0) {
      setCurrentSummary(doc.summaries[0]);
      setCurrentFile({ name: doc.filename });
    }
  }

  function handleNewDocument() {
    setCurrentSummary(null);
    setCurrentFile(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Document Summary Assistant
              </h1>
              <p className="text-sm text-gray-600">
                Upload PDFs or images to generate AI-powered summaries
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!processing && !currentSummary && (
              <FileUpload onFileSelect={handleFileSelect} isProcessing={processing} />
            )}

            {processing && (
              <ProcessingStatus
                stage={processingStage}
                progress={progress}
                fileName={currentFile?.name}
              />
            )}

            {currentSummary && !processing && (
              <>
                <SummaryDisplay
                  summary={currentSummary}
                  fileName={currentFile?.name}
                />

                <div className="flex justify-center">
                  <button
                    onClick={handleNewDocument}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    Upload Another Document
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <DocumentHistory
              key={historyKey}
              onSelectDocument={handleSelectDocument}
              currentDocumentId={currentSummary?.document_id}
            />
          </div>
        </div>
      </main>

      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>Powered by Google Gemini AI and Tesseract OCR</p>
        </div>
      </footer>
    </div>
  );
}
