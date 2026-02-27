# 🚀 Быстрая настройка авторизации Яндекс ID

## 1. Регистрация приложения

### Шаг 1.1: Создайте приложение
1. Перейдите на https://oauth.yandex.ru/
2. Нажмите **"Зарегистрировать новое приложение"**

### Шаг 1.2: Настройте приложение
```
Название: Dear Editorial Office
Платформы: ✓ Веб-сервисы
```

### Шаг 1.3: Добавьте Callback URL
```
https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback
http://localhost:5173/auth/callback
```

### Шаг 1.4: Выберите доступы
```
✓ login:info
✓ login:email  
✓ login:avatar
```

### Шаг 1.5: Сохраните credentials
После создания скопируйте:
- **Client ID**
- **Client Secret** (храните в секрете!)

## 2. Настройка проекта

### Шаг 2.1: Создайте файл `.env`
```bash
cp .env.example .env
```

### Шаг 2.2: Заполните `.env`
```env
VITE_YANDEX_CLIENT_ID=ваш_client_id
VITE_YANDEX_REDIRECT_URI=https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback
```

### Шаг 2.3: Установите зависимости (уже установлено)
```bash
npm install
```

## 3. Настройка бэкенда (ВАЖНО!)

### ⚠️ Критическая безопасность

**Client Secret НЕ ДОЛЖЕН быть в клиентском коде!**

Нужно создать API endpoint на вашем бэкенде:

### Endpoint: `POST /api/auth/exchange`

```typescript
// Пример для Node.js/Express
app.post('/api/auth/exchange', async (req, res) => {
  const { code, redirect_uri } = req.body;
  
  try {
    // Обмен кода на токен
    const response = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.YANDEX_CLIENT_ID,
        client_secret: process.env.YANDEX_CLIENT_SECRET,
        redirect_uri,
      }),
    });
    
    const tokens = await response.json();
    
    // Получаем информацию о пользователе
    const userResponse = await fetch('https://login.yandex.ru/info', {
      headers: {
        'Authorization': `OAuth ${tokens.access_token}`,
      },
    });
    
    const user = await userResponse.json();
    
    res.json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Auth failed' });
  }
});
```

### Для Yandex Cloud Function

Создайте Cloud Function с тем же кодом.

## 4. Обновите authService.ts

Замените URL в [`src/app/auth/authService.ts:106`](src/app/auth/authService.ts:106):

```typescript
const response = await fetch('YOUR_BACKEND_URL/api/auth/exchange', {
  // ...
});
```

## 5. Тестирование

### Локально:
```bash
npm run dev
```

Откройте http://localhost:5173 и нажмите **"Войти через Яндекс"**

### Production:
После деплоя откройте ваш сайт и проверьте авторизацию.

## 6. Проверка работы

✅ **Работает:**
- Кнопка "Войти через Яндекс" отображается
- Клик перенаправляет на страницу авторизации Яндекса
- После авторизации отображается профиль пользователя
- API запросы содержат `Authorization: Bearer <token>` заголовок

## Структура файлов

```
src/app/
├── auth/
│   ├── authService.ts     # Логика OAuth 2.0
│   ├── YandexAuth.tsx     # Кнопка входа
│   ├── UserProfile.tsx    # Профиль пользователя
│   └── AuthCallback.tsx   # Обработка callback
├── App.tsx                # Главная страница
└── AppRouter.tsx          # Роутинг
```

## Troubleshooting

### Ошибка: "Client ID не установлен"
- Проверьте, создан ли файл `.env`
- Убедитесь, что `VITE_YANDEX_CLIENT_ID` заполнен

### Ошибка: "Redirect URI mismatch"
- Проверьте, что URL в `.env` совпадает с настройками в Яндекс OAuth

### Ошибка 500 при обмене кода на токен
- Убедитесь, что бэкенд endpoint `/api/auth/exchange` создан
- Проверьте логи бэкенда

### Токен не попадает в API запросы
- Убедитесь, что пользователь авторизован
- Проверьте localStorage: должен быть ключ `yandex_access_token`

---

**📖 Подробная документация:** [`YANDEX_AUTH_GUIDE.md`](YANDEX_AUTH_GUIDE.md)
