interface ForWhomCardProps {
  title: string;
  description: string;
}

function ForWhomCard({ title, description }: ForWhomCardProps) {
  return (
    <div className="relative flex items-center p-6 md:p-8 gap-3 isolate w-full lg:w-[calc(50%-6px)] min-h-[240px]">
      {/* Background */}
      <div className="absolute inset-0 bg-white rounded-[32px] z-0" />
      
      {/* Content */}
      <div className="relative flex flex-col justify-between gap-6 md:gap-[68px] w-full z-10">
        {/* Title */}
        <h2 className="text-[#191E28] m-0 w-full break-words">
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-[#5F6466] m-0 w-full break-words">
          {description}
        </p>
      </div>
    </div>
  );
}

export function ForWhom() {
  const cards = [
    {
      title: "Маркетологам",
      description: "Которые хотят проверить качество рекламных текстов и соответствовать требованиям гайдов"
    },
    {
      title: "Копирайтерам и редакторам",
      description: "Для быстрой проверки большого количества текстов перед публикацией и экономии времени на ручной модерации"
    }
  ];

  return (
    <section className="flex flex-col items-start py-[60px] pb-[90px] w-full max-w-[1440px] mx-auto">
      {/* Title section */}
      <div className="flex flex-col items-start px-4 md:px-8 lg:px-[78px] pb-[60px] gap-6 w-full">
        <h1 className="text-white m-0 w-full break-words">
          Для кого этот сервис
        </h1>
        <p className="hidden w-full max-w-[652px] text-[#DDC8FF] m-0 break-words">
          Сервис создан для специалистов, которые работают с рекламными кампаниями и хотят соответствовать требованиям площадок.
        </p>
      </div>

      {/* Cards container */}
      <div className="flex flex-col items-end px-4 md:px-8 lg:px-[78px] gap-8 w-full">
        <div className="flex flex-row flex-wrap items-center content-start gap-3 w-full">
          {cards.map((card, index) => (
            <ForWhomCard
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
