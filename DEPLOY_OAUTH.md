# Инструкция по развертыванию OAuth Backend

Пошаговая инструкция для развертывания Yandex Cloud Function для OAuth.

## Шаг 1: Установка Yandex Cloud CLI

### macOS (через Homebrew)
```bash
brew install yandex-cloud/tap/yc
```

### Linux/macOS (универсальный способ)
```bash
curl https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash
```

После установки перезапустите терминал.

## Шаг 2: Инициализация YC CLI

```bash
yc init
```

Следуйте инструкциям:
1. Войдите в браузере
2. Выберите облако (cloud)
3. Выберите каталог (folder)

## Шаг 3: Получите client_secret

1. Зайдите на https://oauth.yandex.ru/
2. Войдите в аккаунт
3. Найдите ваше приложение (Client ID: `be1ada40fb6a4d6a8193532a814c4a9d`)
4. Скопируйте **Client Secret**

⚠️ **ВАЖНО**: Client Secret держите в секрете! Не коммитьте его в git!

## Шаг 4: Создайте Cloud Function

```bash
# Создайте функцию
yc serverless function create --name=oauth-exchange

# Перейдите в директорию с функцией
cd yandex-oauth-exchange

# Создайте zip архив
zip function.zip index.js package.json

# Загрузите функцию с переменными окружения
# ЗАМЕНИТЕ <your_client_secret> на реальный client_secret!
yc serverless function version create \
  --function-name=oauth-exchange \
  --runtime nodejs18 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 10s \
  --source-path ./function.zip \
  --environment YANDEX_CLIENT_ID=be1ada40fb6a4d6a8193532a814c4a9d \
  --environment YANDEX_CLIENT_SECRET=<your_client_secret>
```

## Шаг 5: Сделайте функцию публичной

```bash
yc serverless function allow-unauthenticated-invoke oauth-exchange
```

## Шаг 6: Получите URL функции

```bash
yc serverless function get oauth-exchange --format json | grep http_invoke_url
```

Скопируйте URL, он будет выглядеть примерно так:
```
https://functions.yandexcloud.net/d4e...
```

## Шаг 7: Настройте frontend

Откройте файл `.env` и добавьте:

```bash
VITE_OAUTH_BACKEND_URL=https://your-function-url.yandexcloud.net
```

Перезапустите dev-сервер:
```bash
npm run dev
```

## Шаг 8: Протестируйте

1. Зайдите на http://localhost:5173
2. Нажмите "Войти"
3. Авторизуйтесь через Яндекс
4. Проверьте, что авторизация прошла успешно

## Опционально: Создайте API Gateway для красивого URL

Создайте файл `api-gateway-spec.yaml`:

```yaml
openapi: 3.0.0
info:
  title: OAuth Exchange API
  version: 1.0.0

paths:
  /api/auth/exchange:
    post:
      summary: Exchange authorization code for access token
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: <FUNCTION_ID>  # Получите через: yc serverless function get oauth-exchange --format json | grep \"^id\"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - code
              properties:
                code:
                  type: string
                redirect_uri:
                  type: string
      responses:
        '200':
          description: Success
    options:
      summary: CORS preflight
      x-yc-apigateway-integration:
        type: dummy
        http_code: 200
        content:
          '*': ''
      responses:
        '200':
          description: CORS headers
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
            Access-Control-Allow-Methods:
              schema:
                type: string
                default: 'POST, OPTIONS'
            Access-Control-Allow-Headers:
              schema:
                type: string
                default: 'Content-Type'
```

Создайте API Gateway:

```bash
yc serverless api-gateway create \
  --name oauth-api \
  --spec=yandex-oauth-exchange/api-gateway-spec.yaml
```

Получите URL API Gateway:

```bash
yc serverless api-gateway get oauth-api --format json | grep domain
```

Обновите `.env`:

```bash
VITE_OAUTH_BACKEND_URL=https://your-api-gateway.apigw.yandexcloud.net/api/auth/exchange
```

## Для Production

Для GitHub Pages также нужно обновить переменную окружения в `.env`:

```bash
# Production redirect URI
VITE_YANDEX_REDIRECT_URI=https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback

# Production OAuth backend
VITE_OAUTH_BACKEND_URL=https://your-api-gateway.apigw.yandexcloud.net/api/auth/exchange
```

Также нужно добавить production redirect URI в настройки приложения на https://oauth.yandex.ru/:
```
https://zdravohvalakesanetreba.github.io/dear_editorial_office/auth/callback
```

## Стоимость

Yandex Cloud Functions имеет бесплатный уровень:
- 1 млн вызовов в месяц
- 10 ГБ-часов вычислений

Для OAuth авторизации этого более чем достаточно!

## Мониторинг

Просмотр логов функции:

```bash
yc serverless function logs oauth-exchange
```

Просмотр статистики:

```bash
yc serverless function version list --function-name oauth-exchange
```

## Обновление функции

Если нужно обновить код функции:

```bash
cd yandex-oauth-exchange
zip function.zip index.js package.json
yc serverless function version create \
  --function-name=oauth-exchange \
  --runtime nodejs18 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 10s \
  --source-path ./function.zip \
  --environment YANDEX_CLIENT_ID=be1ada40fb6a4d6a8193532a814c4a9d \
  --environment YANDEX_CLIENT_SECRET=<your_client_secret>
```

## Troubleshooting

### Ошибка "Не удалось обменять код на токен"

Проверьте логи функции:
```bash
yc serverless function logs oauth-exchange --follow
```

### Ошибка CORS

Убедитесь, что функция возвращает правильные CORS заголовки.

### Ошибка "redirect_uri не совпадает"

Проверьте, что redirect_uri в настройках приложения на oauth.yandex.ru совпадает с тем, что используется в коде.

## Безопасность

- ✅ Client Secret хранится только в Cloud Function (в переменных окружения)
- ✅ CORS настроен корректно
- ✅ Функция изолирована в Yandex Cloud
- ✅ Логи доступны только владельцу

Никогда не коммитьте client_secret в git!
