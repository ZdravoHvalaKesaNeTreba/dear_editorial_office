# Руководство по интеграции Яндекс ID

## Шаг 1: Регистрация приложения в Яндексе

1. Перейдите на [OAuth консоль Яндекса](https://oauth.yandex.ru/)
2. Нажмите "Зарегистрировать новое приложение"
3. Заполните форму:
   - **Название**: Dear Editorial Office
   - **Платформы**: Веб-сервисы
   - **Redirect URI**: 
     - `https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback`
     - `http://localhost:5173/auth/callback` (для разработки)
   - **Доступы**: 
     - ✓ Доступ к логину, имени и фамилии, полу
     - ✓ Доступ к адресу электронной почты
     - ✓ Доступ к аватару пользователя

4. После создания получите:
   - **Client ID** (идентификатор приложения)
   - **Client Secret** (секретный ключ)

## Шаг 2: Установка зависимостей

```bash
npm install js-cookie
```

## Шаг 3: Создание файлов для авторизации

Структура файлов:
```
src/
├── app/
│   ├── App.tsx (обновить)
│   ├── auth/
│   │   ├── YandexAuth.tsx
│   │   ├── AuthCallback.tsx
│   │   └── authService.ts
│   └── components/
│       └── UserProfile.tsx
```

## Шаг 4: Конфигурация

Создайте файл `.env` в корне проекта:

```env
VITE_YANDEX_CLIENT_ID=your_client_id_here
VITE_YANDEX_REDIRECT_URI=https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback
```

Добавьте `.env` в `.gitignore`:
```
.env
.env.local
```

## Шаг 5: Структура авторизации

### authService.ts
Сервис для работы с OAuth 2.0:
- Генерация URL для авторизации
- Обмен кода на токен
- Получение информации о пользователе
- Сохранение/удаление токенов

### YandexAuth.tsx
Кнопка "Войти через Яндекс" с логикой авторизации

### AuthCallback.tsx
Обработчик callback после успешной авторизации

### UserProfile.tsx
Компонент профиля пользователя (аватар, имя, кнопка выхода)

## Шаг 6: Обновление API запросов

После авторизации все запросы к API должны включать токен:

```typescript
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`, // Добавить токен
  },
  body: JSON.stringify({ service, text }),
});
```

## Шаг 7: Настройка роутинга

Обновить `App.tsx` для поддержки авторизации и защищенных маршрутов.

## Безопасность

⚠️ **Важно:**
- **Client Secret** НЕ должен храниться в клиентском коде
- Обмен кода на токен должен происходить на бэкенде
- Токены должны храниться в httpOnly cookies (если возможно)

## API бэкенда (требуется создать)

### POST /api/auth/exchange
Обменивает authorization code на access token:

**Запрос:**
```json
{
  "code": "authorization_code",
  "redirect_uri": "callback_url"
}
```

**Ответ:**
```json
{
  "access_token": "token",
  "expires_in": 3600,
  "token_type": "Bearer",
  "user": {
    "id": "user_id",
    "login": "username",
    "display_name": "User Name",
    "default_avatar_id": "avatar_id"
  }
}
```

### GET /api/auth/me
Получает информацию о текущем пользователе по токену.

## Тестирование

1. Запустите dev-сервер: `npm run dev`
2. Откройте браузер: `http://localhost:5173`
3. Нажмите "Войти через Яндекс"
4. Авторизуйтесь через Яндекс
5. Проверьте, что профиль отображается
6. Проверьте, что API запросы содержат токен

## Дополнительные материалы

- [Документация Яндекс OAuth](https://yandex.ru/dev/id/doc/ru/)
- [Пример интеграции](https://github.com/yandex/oauth)
- [Яндекс.Паспорт API](https://yandex.ru/dev/passport/doc/dg/index.html)

---

**Статус:** Готово к имплементации  
**Следующий шаг:** Создать файлы реализации
