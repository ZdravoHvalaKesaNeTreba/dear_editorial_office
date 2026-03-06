# Статус проекта в Production

**Дата проверки:** 2 марта 2026, 18:58 МСК  
**Последний коммит:** `14cd450` - "Усилена обработка ответов API для предотвращения React error #31"

## 🌐 URLs

- **GitHub Pages (оригинальный):** https://zdravohvalakesanetreba.github.io/dear_editorial_office/
- **Кастомный домен:** https://deareditor.maksimprojects.space/
- **Статус редиректа:** ✅ Настроен (301 redirect с GitHub Pages на кастомный домен)

## ⚠️ КРИТИЧЕСКАЯ ПРОБЛЕМА

### Сайт не работает на кастомном домене

**Проблема:** Белая страница, ошибки 404 при загрузке ресурсов

**Причина:**  
HTML генерируется с путями `/dear_editorial_office/assets/...`, но на кастомном домене файлы должны быть доступны по пути `/assets/...`

**Пример из HTML:**
```html
<link rel="icon" type="image/png" href="/dear_editorial_office/favicon.png" />
<script type="module" crossorigin src="/dear_editorial_office/assets/index-BOehGU3Q.js"></script>
<link rel="stylesheet" crossorigin href="/dear_editorial_office/assets/index-RXDmYHQp.css">
```

**Ошибки в консоли:**
```
Failed to load resource: the server responded with a status of 404 ()
Failed to load resource: the server responded with a status of 404 ()
Failed to load resource: the server responded with a status of 404 ()
```

### Решение

Необходимо обновить [`vite.config.ts`](vite.config.ts:7):
```typescript
// Было:
base: mode === 'production' ? '/dear_editorial_office/' : '/',

// Должно быть (для кастомного домена):
base: '/',
```

ИЛИ настроить переменную окружения для гибкости:
```typescript
base: process.env.VITE_BASE_PATH || '/',
```

И в [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml:37) добавить:
```yaml
env:
  VITE_BASE_PATH: '/'  # Для кастомного домена
  # VITE_BASE_PATH: '/dear_editorial_office/'  # Для GitHub Pages без домена
```

## ✅ Backend Services - Работают

### 1. API проверки текстов
- **URL:** `https://d5d8madjmjgdsb9bp0jh.cmxivbes.apigw.yandexcloud.net/api/check`
- **Статус:** ✅ **РАБОТАЕТ**
- **Метод:** POST
- **Тест:**
  ```bash
  curl -X POST https://d5d8madjmjgdsb9bp0jh.cmxivbes.apigw.yandexcloud.net/api/check \
    -H "Content-Type: application/json" \
    -d '{"text":"Тестовый текст","service":"direct"}'
  ```
- **Ответ:** `{"id":"32","issues":[]}`
- **CORS:** Настроен корректно (`access-control-allow-origin: *`)

### 2. OAuth Backend
- **Переменная:** `VITE_OAUTH_BACKEND_URL` (из GitHub Secrets)
- **Статус:** ⚠️ Не проверен (требуется авторизация для теста)
- **Настройка:** Согласно [`DEPLOY_OAUTH.md`](DEPLOY_OAUTH.md)

## 📦 Конфигурация деплоя

### GitHub Actions Workflow
- **Файл:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- **Триггер:** Push в ветку `main`
- **Node версия:** 18
- **Команда сборки:** `npm run build`

### Переменные окружения (Production)
```yaml
VITE_YANDEX_CLIENT_ID: ${{ secrets.VITE_YANDEX_CLIENT_ID }}
VITE_YANDEX_REDIRECT_URI: https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback
VITE_API_URL: https://d5d8madjmjgdsb9bp0jh.cmxivbes.apigw.yandexcloud.net/api/check
VITE_OAUTH_BACKEND_URL: ${{ secrets.VITE_OAUTH_BACKEND_URL }}
```

⚠️ **Требует обновления:** `VITE_YANDEX_REDIRECT_URI` должен использовать кастомный домен:
```
VITE_YANDEX_REDIRECT_URI: https://deareditor.maksimprojects.space/auth/callback
```

## 📊 Git статус

```
Branch: main
Status: up to date with origin/main

Последние коммиты:
14cd450 Усилена обработка ответов API для предотвращения React error #31
26de99a Исправлена обработка ответа API и защита от краша
1a47501 Исправлены проблемы с шрифтами и добавлен favicon
0619f17 Добавлен год 2026 в футер
a64a988 Add GitHub Actions workflow and fix long dash
```

## 🔧 Необходимые действия

### Высокий приоритет (сайт не работает!)

1. **Исправить base path в vite.config.ts**
   - Изменить `base` с `/dear_editorial_office/` на `/`
   - Пересобрать и задеплоить

2. **Обновить redirect URI для OAuth**
   - В настройках приложения на https://oauth.yandex.ru/
   - Добавить: `https://deareditor.maksimprojects.space/auth/callback`
   - Обновить в GitHub Actions: `VITE_YANDEX_REDIRECT_URI`

### Средний приоритет

3. **Добавить переменные окружения для гибкости**
   - Использовать `VITE_BASE_PATH` для управления base path
   - Позволит легко переключаться между GitHub Pages и кастомным доменом

4. **Проверить OAuth функциональность**
   - После исправления base path
   - Протестировать полный flow авторизации

### Низкий приоритет

5. **Документация**
   - Обновить README.md с правильным production URL
   - Добавить заметки о кастомном домене

## 📝 Рекомендации

1. **Мониторинг**
   - Настроить Uptime monitoring для https://deareditor.maksimprojects.space/
   - Проверять логи API Gateway регулярно

2. **Testing**
   - Добавить E2E тесты для production environment
   - Автоматическая проверка после деплоя

3. **Performance**
   - Рассмотреть использование CDN для статики
   - Оптимизация размера бандла (текущий не проверен из-за 404)

## 🎯 Краткое резюме

| Компонент | Статус | Описание |
|-----------|--------|----------|
| Frontend (GitHub Pages) | ❌ | Не работает из-за неправильного base path |
| Frontend (Custom Domain) | ❌ | Не работает из-за неправильного base path |
| API проверки текстов | ✅ | Работает корректно |
| OAuth Backend | ⚠️ | Не протестирован, требует исправления redirect URI |
| GitHub Actions | ✅ | Настроен и работает |
| Custom Domain | ✅ | Домен настроен, редирект работает |

**Основная проблема:** Конфигурация `base` в Vite не соответствует кастомному домену.  
**Время на исправление:** ~5 минут + время на деплой (~2-3 минуты).
