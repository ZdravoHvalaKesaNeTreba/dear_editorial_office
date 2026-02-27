/**
 * Yandex Cloud Function для обмена authorization code на access token
 * 
 * Эту функцию нужно развернуть в Yandex Cloud Functions
 * и настроить API Gateway для доступа
 */

const https = require('https');

// URL для обмена токенов
const YANDEX_TOKEN_URL = 'oauth.yandex.ru';

/**
 * Обменивает authorization code на access token
 */
function exchangeToken(code, clientId, clientSecret, redirectUri) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }).toString();

    const options = {
      hostname: YANDEX_TOKEN_URL,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error('Не удалось распарсить ответ от Яндекс OAuth'));
          }
        } else {
          reject(new Error(`Ошибка от Яндекс OAuth: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Обработчик запросов Cloud Function
 */
module.exports.handler = async function (event, context) {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Обрабатываем preflight запрос
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Проверяем метод
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Получаем параметры из тела запроса
    const body = JSON.parse(event.body || '{}');
    const { code, redirect_uri } = body;

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameter: code' }),
      };
    }

    // Получаем client_id и client_secret из переменных окружения
    const clientId = process.env.YANDEX_CLIENT_ID;
    const clientSecret = process.env.YANDEX_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('YANDEX_CLIENT_ID или YANDEX_CLIENT_SECRET не установлены');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Обмениваем code на токен
    const tokens = await exchangeToken(code, clientId, clientSecret, redirect_uri);

    // Возвращаем токены
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(tokens),
    };

  } catch (error) {
    console.error('Ошибка при обмене токена:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to exchange token',
        message: error.message,
      }),
    };
  }
};
