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
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-gray-400 text-center text-lg">
          Добавь текст в соседнее поле, чтобы начать
        </p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-8">
      {result.hasErrors ? (
        <>
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 shadow-sm">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-['YS_Display'] font-bold text-center mb-6 text-[#191E28]">
            Найдены стоп-слова
          </h2>
          <div className="space-y-3 w-full max-h-96 overflow-y-auto">
            {result.stopWords.map((word, index) => (
              <div
                key={index}
                className="px-5 py-3 bg-red-50 rounded-2xl text-red-700 font-medium border border-red-100 hover:bg-red-100 transition-colors"
              >
                {word}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-sm">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-['YS_Display'] font-bold text-center text-[#191E28]">
            Стоп-слова не найдены
          </h2>
          <p className="text-gray-500 text-center mt-4">
            Текст соответствует требованиям
          </p>
        </>
      )}
    </div>
  );
}
