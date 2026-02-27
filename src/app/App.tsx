import { useState } from 'react';
import { Header } from './components/Header';
import { ServiceSelector, type Service } from './components/ServiceSelector';
import { TextEditor } from './components/TextEditor';
import { ResultsPanel, CheckResult } from './components/ResultsPanel';
import { Footer } from './components/Footer';
import { YandexAuth } from './auth/YandexAuth';
import { authService } from './auth/authService';

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
      const hasErrors = data.issues && data.issues.length > 0;
      const stopWords = data.issues || [];
      
      setResult({
        hasErrors,
        stopWords,
        message: hasErrors ? 'Найдены стоп-слова' : 'Стоп-слова не найдены',
      });
      setIsChecked(true);
    } catch (error) {
      console.error('Error checking text:', error);
      setResult({
        hasErrors: false,
        stopWords: [],
        message: 'Ошибка при проверке текста',
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Кнопка авторизации в правом верхнем углу */}
        <div className="flex justify-end mb-4">
          <YandexAuth />
        </div>
        
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