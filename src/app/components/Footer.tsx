export function Footer() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-12 pb-8 border-t border-white/10 mt-12 gap-6">
      <div>
        <span className="text-[#9CA3AF] text-base">
          Приносите замечания и идеи по улучшению —{' '}
        </span>
        <a 
          href="https://t.me/yndx_mironovmax" 
          className="text-[#FC0] hover:text-[#FFD633] transition-colors font-medium" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Максиму Миронову
        </a>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <a 
          href="#" 
          className="text-white hover:text-[#FC0] transition-colors text-base font-medium"
        >
          Единый юридический гайд
        </a>
        <a 
          href="#" 
          className="text-white hover:text-[#FC0] transition-colors text-base font-medium"
        >
          Редакционные политики
        </a>
      </div>
    </div>
  );
}
