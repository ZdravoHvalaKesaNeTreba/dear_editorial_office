export function Footer() {
  return (
    <div className="flex justify-between items-center pt-8 border-t border-gray-300 mt-12">
      <div>
        <span className="text-gray-600">
          Приносите замечания и идеи по улучшению —{' '}
        </span>
        <a href="https://t.me/yndx_mironovmax" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
          Максиму Миронову
        </a>
      </div>
      <div className="flex gap-6">
        <a href="#" className="text-blue-600 hover:underline">
          Единый юридический гайд
        </a>
        <a href="#" className="text-blue-600 hover:underline">
          Редакционные политики
        </a>
      </div>
    </div>
  );
}