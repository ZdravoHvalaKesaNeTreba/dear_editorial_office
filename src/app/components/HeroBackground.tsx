/**
 * ИНСТРУКЦИЯ: 
 * 1. Сохраните изображение редактора в src/assets/editor_hero.jpg
 * 2. Перезапустите dev сервер если необходимо
 */

export function HeroBackground() {
  return (
    <>
      {/* Изображение редактора справа с плавным переходом */}
      <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#6C3ED9]/30 to-[#6C3ED9] z-10"></div>
        <img 
          src="/src/assets/editor_hero.jpg"
          alt="Editor workspace" 
          className="absolute right-0 top-0 h-full w-auto object-cover opacity-20"
          onError={(e) => {
            // Если изображение не загрузилось, скрываем элемент
            e.currentTarget.style.display = 'none';
            console.log('Добавьте изображение editor_hero.jpg в папку src/assets/');
          }}
        />
      </div>

      {/* Тонкие геометрические элементы поверх */}
      <div className="absolute right-0 top-0 w-2/5 h-full overflow-hidden pointer-events-none z-20 opacity-40">
        <div className="absolute right-32 top-32 w-32 h-32 border border-white/10 rounded-3xl rotate-12"></div>
        <div className="absolute right-20 bottom-40 w-24 h-24 border border-[#FC0]/20 rounded-2xl -rotate-6"></div>
      </div>
    </>
  );
}
