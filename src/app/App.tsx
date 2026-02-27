import { useState } from 'react';
import { Header } from './components/Header';
import { FeatureCards } from './components/FeatureCards';
import { ServiceSelector, type Service } from './components/ServiceSelector';
import { TextEditor } from './components/TextEditor';
import { ResultsPanel, CheckResult } from './components/ResultsPanel';
import { Footer } from './components/Footer';
import { ForWhom } from './components/ForWhom';
import { YandexAuth } from './auth/YandexAuth';
import { authService } from './auth/authService';
import logoEdit from '../assets/logo_edit.png';

const API_URL = "https://d5d8madjmjgdsb9bp0jh.cmxivbes.apigw.yandexcloud.net/api/check";

export default function App() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = async () => {
    if (!selectedService || !text.trim()) return;

    try {
      // Получаем токен доступа, если пользователь авторизован
      const token = authService.getAccessToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Добавляем Authorization заголовок, если есть токен
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          service: selectedService.id,
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при проверке текста');
      }

      const data = await response.json();
      
      // API возвращает { id, issues } вместо { hasErrors, stopWords }
      // Обрабатываем случай, когда issues может быть массивом объектов или строк
      let stopWords: string[] = [];
      if (Array.isArray(data.issues)) {
        stopWords = data.issues.map((issue: any) => {
          if (typeof issue === 'string') {
            return issue;
          } else if (issue && typeof issue === 'object') {
            // Если это объект, пытаемся извлечь нужное поле
            return issue.word || issue.text || issue.issue || JSON.stringify(issue);
          }
          return String(issue);
        });
      }
      
      const hasErrors = stopWords.length > 0;
      
      setResult({
        hasErrors,
        stopWords,
        message: hasErrors ? 'Найдены стоп-слова' : 'Стоп-слова не найдены',
      });
      setIsChecked(true);
    } catch (error) {
      console.error('Error checking text:', error);
      // Логируем детальную информацию об ошибке
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      setResult({
        hasErrors: false,
        stopWords: [],
        message: 'Ошибка при проверке текста. Попробуйте еще раз.',
      });
      setIsChecked(true);
    }
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
    <div className="min-h-screen bg-[#191E28] p-0">
      {/* Верхняя секция с основным функционалом */}
      <div className="relative bg-gradient-to-br from-[#6C3ED9] via-[#4B2BA8] to-[#191E28] pb-16">
        <div className="max-w-7xl mx-auto px-8 pt-8">
          {/* Логотип и кнопка авторизации на одной линии */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-['YS_Display'] font-bold text-3xl tracking-tight">
                Дорогая
              </h2>
              <div className="flex items-center justify-center w-[38px] h-[38px] bg-white rounded-full overflow-hidden">
                <img src={logoEdit} alt="Edit" className="w-[85%] h-[85%] object-contain" />
              </div>
              <h2 className="text-white font-['YS_Display'] font-bold text-3xl tracking-tight">
                Редакция
              </h2>
            </div>
            <YandexAuth />
          </div>
          
          <div className="mb-12">
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

          {/* Карточки с возможностями */}
          <FeatureCards />

          <ServiceSelector
            selectedService={selectedService}
            onServiceChange={setSelectedService}
          />

          <div className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TextEditor
                text={text}
                onTextChange={handleTextChange}
                onCheck={handleCheck}
                isChecked={isChecked}
                hasErrors={result?.hasErrors || false}
              />

              <div className="bg-white rounded-[32px] border border-gray-200 min-h-[400px]">
                <ResultsPanel result={result} isEmpty={!text.trim()} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Секция "Для кого" */}
      <div className="bg-[#191E28]">
        <ForWhom />
      </div>

      {/* Футер */}
      <div className="bg-[#191E28] px-8">
        <div className="max-w-7xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}