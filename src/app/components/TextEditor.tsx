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
    : 'border-gray-200';

  return (
    <div
      className={`relative bg-gray-50 rounded-[24px] border-2 ${borderColor} transition-colors`}
    >
      {isChecked && (
        <button
          onClick={() => onTextChange('')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="p-8">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Напиши или вставь текст для проверки"
          className="w-full h-64 bg-transparent resize-none outline-none placeholder:text-gray-400 font-['YS_Text'] text-base leading-relaxed"
        />
      </div>

      <div className="px-8 pb-8">
        <button
          onClick={onCheck}
          disabled={!text.trim()}
          className="px-8 py-3 bg-[#FC0] hover:bg-[#FFD633] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-2xl transition-all font-medium text-[#191E28] shadow-sm hover:shadow-md disabled:shadow-none"
        >
          Проверить
        </button>
      </div>
    </div>
  );
}
