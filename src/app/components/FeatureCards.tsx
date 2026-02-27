interface FeatureCardProps {
  title: string;
  tag?: string;
  variant?: 'light' | 'dark' | 'purple';
}

function FeatureCard({ title, tag, variant = 'light' }: FeatureCardProps) {
  const variantStyles = {
    light: 'bg-white text-[#191E28]',
    dark: 'bg-[#191E28] text-white border border-white/10',
    purple: 'bg-[#6C3ED9]/30 backdrop-blur-sm text-white border border-white/20',
  };

  return (
    <div className={`${variantStyles[variant]} rounded-3xl p-8 shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300`}>
      {tag && (
        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium mb-4">
          {tag}
        </span>
      )}
      <h3 className="text-2xl font-['YS_Display'] font-bold leading-tight">
        {title}
      </h3>
    </div>
  );
}

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <FeatureCard 
        title="Проверка текстов на юридические ограничения и соответствие ToV"
        tag="Быстро"
        variant="light"
      />
      <FeatureCard 
        title="Подсказки слов и формулировок от юристов и пиара"
        tag="Полное сопровождение"
        variant="purple"
      />
      <FeatureCard 
        title="Избегайте блокировки объявлений и экономьте время на модерации"
        tag="Быстрое тестирование"
        variant="dark"
      />
    </div>
  );
}
