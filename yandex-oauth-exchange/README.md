# Yandex OAuth Exchange Cloud Function

Это Cloud Function для безопасного обмена authorization code на access token через Яндекс OAuth.

## Почему нужна эта функция?

Обмен кода на токен требует `client_secret`, который нельзя хранить в frontend коде. Эта функция выполняет обмен на серверной стороне.

## Развертывание в Yandex Cloud

### 1. Создайте Cloud Function

```bash
# Установите Yandex Cloud CLI если еще не установлен
# https://cloud.yandex.ru/docs/cli/quickstart

# Войдите в аккаунт
yc init

# Создайте функцию
yc serverless function create --name=oauth-exchange
```

### 2. Загрузите код

```bash
# Перейдите в директорию с функцией
cd yandex-oauth-exchange

# Создайте zip архив
zip function.zip index.js

# Загрузите в Cloud Functions
yc serverless function version create \
  --function-name=oauth-exchange \
  --runtime nodejs18 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 10s \
  --source-path ./function.zip \
  --environment YANDEX_CLIENT_ID=<ваш_client_id> \
  --environment YANDEX_CLIENT_SECRET=<ваш_client_secret>
```

### 3. Сделайте функцию публичной

```bash
yc serverless function allow-unauthenticated-invoke oauth-exchange
```

### 4. Получите URL функции

```bash
yc serverless function get oauth-exchange
```

URL будет выглядеть примерно так:
```
https://functions.yandexcloud.net/d4e...
```

### 5. Настройте API Gateway (опционально, но рекомендуется)

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
        function_id: <function_id>
        service_account_id: <service_account_id>
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
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  expires_in:
                    type: integer
                  token_type:
                    type: string
    options:
      summary: CORS preflight
      responses:
        '200':
          description: CORS headers
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
            Access-Control-Allow-Methods:
              schema:
                type: string
            Access-Control-Allow-Headers:
              schema:
                type: string
```

Создайте API Gateway:

```bash
yc serverless api-gateway create \
  --name oauth-api \
  --spec=api-gateway-spec.yaml
```

### 6. Обновите frontend

После развертывания обновите `authService.ts`:

```typescript
async exchangeCodeForToken(code: string): Promise<AuthTokens> {
  const response = await fetch('https://your-api-gateway-url.apigw.yandexcloud.net/api/auth/exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      redirect_uri: this.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Не удалось обменять код на токен');
  }

  const tokens: AuthTokens = await response.json();
  this.saveTokens(tokens);
  return tokens;
}
```

## Где взять client_secret?

1. Зайдите на https://oauth.yandex.ru/
2. Найдите ваше приложение
3. Client Secret находится на странице приложения

⚠️ **ВАЖНО**: Никогда не коммитьте client_secret в git!

## Переменные окружения

- `YANDEX_CLIENT_ID` - Client ID вашего приложения
- `YANDEX_CLIENT_SECRET` - Client Secret (держите в секрете!)

## Безопасность

1. ✅ Client secret хранится только в Cloud Function
2. ✅ CORS настроен для вашего домена
3. ✅ Функция выполняется в изолированной среде
4. ✅ Логи доступны только вам

## Тестирование

```bash
curl -X POST https://your-function-url/api/auth/exchange \
  -H "Content-Type: application/json" \
  -d '{
    "code": "authorization_code_from_yandex",
    "redirect_uri": "http://localhost:5173/auth/callback"
  }'
```

## Стоимость

Cloud Functions в Yandex Cloud имеет бесплатный уровень (Free Tier):
- 1 млн вызовов в месяц
- 10 ГБ-часов вычислений

Для OAuth это более чем достаточно!
