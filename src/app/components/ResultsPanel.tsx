import { Check, AlertCircle } from 'lucide-react';

export interface CheckResult {
  hasErrors: boolean;
  stopWords: string[];
  message: string;
}

interface ResultsPanelProps {
  result: CheckResult | null;
  isEmpty: boolean;
}

export function ResultsPanel({ result, isEmpty }: ResultsPanelProps) {
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-center px-8">
          Добавь текст в соседнее поле, чтобы начать
        </p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      {result.hasErrors ? (
        <>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl text-center mb-4">Найдены стоп-слова</h2>
          <div className="space-y-2 w-full">
            {result.stopWords.map((word, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-red-50 rounded-lg text-red-700"
              >
                {word}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl text-center">Стоп-слова не найдены</h2>
        </>
      )}
    </div>
  );
}
