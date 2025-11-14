import { Loader2, FileText, Sparkles, CheckCircle } from 'lucide-react';

export default function ProcessingStatus({ stage, progress, fileName }) {
  const stages = [
    { id: 'uploading', label: 'Uploading', icon: FileText },
    { id: 'extracting', label: 'Extracting Text', icon: FileText },
    { id: 'summarizing', label: 'Generating Summaries', icon: Sparkles },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const currentStageIndex = stages.findIndex(s => s.id === stage);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <h3 className="font-semibold text-gray-900">Processing Document</h3>
        </div>
        <p className="text-sm text-gray-600">{fileName}</p>
      </div>

      <div className="space-y-3">
        {stages.map((stageItem, index) => {
          const Icon = stageItem.icon;
          const isActive = index === currentStageIndex;
          const isComplete = index < currentStageIndex;

          return (
            <div key={stageItem.id} className="flex items-center gap-3">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  ${isComplete ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'}
                `}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isComplete ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isComplete || isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {stageItem.label}
                </p>
              </div>

              {isActive && progress > 0 && (
                <span className="text-xs text-gray-500">{progress}%</span>
              )}
            </div>
          );
        })}
      </div>

      {progress > 0 && stage === 'extracting' && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
