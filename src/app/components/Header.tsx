import { Logo } from './Logo';

export function Header() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <Logo />
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
          Бесплатно
        </span>
        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
          Онлайн
        </span>
      </div>
      
      <h1 className="text-white mb-6 leading-tight max-w-3xl">
        Сервис проверки текстов для Яндекс Рекламы
      </h1>
    </div>
  );
}
