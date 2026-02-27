import { X } from 'lucide-react';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  onCheck: () => void;
  isChecked: boolean;
  hasErrors: boolean;
}

export function TextEditor({
  text,
  onTextChange,
  onCheck,
  isChecked,
  hasErrors,
}: TextEditorProps) {
  const borderColor = isChecked
    ? hasErrors
      ? 'border-red-400'
      : 'border-green-400'
    : 'border-gray-300';

  return (
    <div
      className={`relative bg-gray-100 rounded-2xl border-2 ${borderColor} transition-colors`}
    >
      {isChecked && (
        <button
          onClick={() => onTextChange('')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="p-6">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Напиши или вставь текст для проверки"
          className="w-full h-64 bg-transparent resize-none outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={onCheck}
          disabled={!text.trim()}
          className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          Проверить
        </button>
      </div>
    </div>
  );
}
