import { useEffect, useState } from 'react';
import { authService } from './authService';

export function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Получаем параметры из URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');

      // Проверка на ошибку от Яндекса
      if (errorParam) {
        throw new Error(`Ошибка авторизации: ${errorParam}`);
      }

      // Проверка наличия кода
      if (!code) {
        throw new Error('Authorization code не найден');
      }

      // Проверка state (защита от CSRF)
      if (!state || !authService.validateState(state)) {
        throw new Error('Недействительный state. Возможная CSRF атака.');
      }

      // Обмен кода на токен
      await authService.exchangeCodeForToken(code);

      setStatus('success');

      // Перенаправляем на главную страницу через 2 секунды
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (err) {
      console.error('Ошибка при обработке callback:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-300 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              Авторизация...
            </h2>
            <p className="text-gray-600 text-center">
              Подождите, мы завершаем процесс авторизации через Яндекс ID
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-300 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Успешная авторизация!
            </h2>
            <p className="text-gray-600 text-center">
              Вы успешно вошли в систему. Перенаправляем на главную страницу...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-300 p-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Ошибка авторизации
          </h2>
          <p className="text-gray-600 text-center">
            {error || 'Произошла ошибка при авторизации'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}
