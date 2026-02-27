import { useState } from 'react';
import { Header } from './components/Header';
import { ServiceSelector, type Service } from './components/ServiceSelector';
import { TextEditor } from './components/TextEditor';
import { ResultsPanel, CheckResult } from './components/ResultsPanel';
import { Footer } from './components/Footer';

// Список стоп-слов для разных сервисов
const stopWordsByService: Record<string, string[]> = {
  direct: ['100% гарантия', 'лучшая цена', 'бесплатно', 'самый дешевый', 'только сегодня'],
  rsya: ['гарантия результата', 'лучшее предложение', 'абсолютно бесплатно', 'номер один'],
  business: ['номер 1', 'самый надежный', 'абсолютная гарантия', 'уникальное предложение'],
  metrika: ['полная конфиденциальность', 'абсолютная точность', 'лучшая аналитика'],
  products: ['гарантия возврата', 'всегда в наличии', 'самая низкая цена', 'бесплатная доставка'],
  rhythm: ['лучшая музыка', 'эксклюзивный контент', 'только у нас', 'бесплатный доступ'],
  view: ['гарантия качества', 'лучшие видео', 'эксклюзивно', 'только здесь'],
};

export default function App() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => {
    if (!selectedService || !text.trim()) return;

    const stopWords = stopWordsByService[selectedService.id] || [];
    const lowerText = text.toLowerCase();
    
    const foundStopWords = stopWords.filter(word => 
      lowerText.includes(word.toLowerCase())
    );

    const hasErrors = foundStopWords.length > 0;

    setResult({
      hasErrors,
      stopWords: foundStopWords,
      message: hasErrors ? 'Найдены стоп-слова' : 'Стоп-слова не найдены',
    });
    setIsChecked(true);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (newText === '') {
      setResult(null);
      setIsChecked(false);
    } else if (isChecked) {
      setIsChecked(false);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <ServiceSelector
          selectedService={selectedService}
          onServiceChange={setSelectedService}
        />

        <div className="bg-white rounded-2xl border border-gray-300 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TextEditor
              text={text}
              onTextChange={handleTextChange}
              onCheck={handleCheck}
              isChecked={isChecked}
              hasErrors={result?.hasErrors || false}
            />

            <div className="bg-white rounded-2xl border border-gray-300 min-h-[400px]">
              <ResultsPanel result={result} isEmpty={!text.trim()} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}