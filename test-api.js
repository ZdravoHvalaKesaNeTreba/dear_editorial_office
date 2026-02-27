/**
 * Скрипт для тестирования сохранения текста в базу данных через API
 * 
 * Запуск: node test-api.js
 */

const API_URL = "https://d5d8madjmjgdsb9bp0jh.cmxivbes.apigw.yandexcloud.net/api/check";

// Тестовые данные
const testData = {
  service: "direct",
  text: "Тестовый текст для проверки сохранения в базу данных. 100% гарантия лучшая цена."
};

console.log('🚀 Начинаем тестирование API...\n');
console.log('API URL:', API_URL);
console.log('Отправляемые данные:', JSON.stringify(testData, null, 2));
console.log('\n---\n');

// Отправка запроса
fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
  .then(response => {
    console.log('📊 Статус ответа:', response.status, response.statusText);
    console.log('📋 Заголовки ответа:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log('\n---\n');
    
    if (!response.ok) {
      throw new Error(`HTTP ошибка! Статус: ${response.status}`);
    }
    
    return response.json();
  })
  .then(data => {
    console.log('✅ Ответ от API:', JSON.stringify(data, null, 2));
    console.log('\n---\n');
    
    // Проверяем структуру ответа
    if (data.hasOwnProperty('hasErrors')) {
      console.log('✓ Поле hasErrors присутствует:', data.hasErrors);
    } else {
      console.warn('⚠️  Поле hasErrors отсутствует в ответе');
    }
    
    if (data.hasOwnProperty('stopWords')) {
      console.log('✓ Поле stopWords присутствует:', data.stopWords);
    } else {
      console.warn('⚠️  Поле stopWords отсутствует в ответе');
    }
    
    // Проверяем наличие ID записи в базе (если API возвращает)
    if (data.id || data.recordId || data._id) {
      console.log('✅ Запись в базе создана! ID:', data.id || data.recordId || data._id);
    } else {
      console.log('❓ API не возвращает ID записи. Нужно проверить бэкенд-логику.');
    }
    
    console.log('\n✅ Тест завершен успешно!');
  })
  .catch(error => {
    console.error('\n❌ Ошибка при тестировании:', error.message);
    
    if (error.message.includes('fetch is not defined')) {
      console.log('\n💡 Для Node.js < 18 установите node-fetch:');
      console.log('   npm install node-fetch@2');
      console.log('   Затем добавьте в начало скрипта: const fetch = require(\'node-fetch\');');
    }
  });
