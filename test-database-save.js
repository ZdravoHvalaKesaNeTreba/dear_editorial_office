/**
 * Комплексный тест для проверки сохранения записей в базу данных
 * 
 * Запуск: node test-database-save.js
 */

const API_URL = "https://d5d8madjmjgdsb9bp0jh.cmxivbes.apigw.yandexcloud.net/api/check";

// Массив тестовых запросов
const tests = [
  {
    name: 'Direct - Текст со стоп-словами',
    data: {
      service: 'direct',
      text: '100% гарантия лучшая цена бесплатно самый дешевый только сегодня'
    }
  },
  {
    name: 'Direct - Чистый текст',
    data: {
      service: 'direct',
      text: 'Качественная услуга по доступной цене с быстрой доставкой'
    }
  },
  {
    name: 'RSYA - Текст со стоп-словами',
    data: {
      service: 'rsya',
      text: 'гарантия результата лучшее предложение абсолютно бесплатно номер один'
    }
  },
  {
    name: 'Business - Чистый текст',
    data: {
      service: 'business',
      text: 'Современное решение для вашего бизнеса'
    }
  },
  {
    name: 'Metrika - Текст с эмодзи',
    data: {
      service: 'metrika',
      text: 'Аналитика вашего сайта 📊 Подробная статистика посещений'
    }
  }
];

// Функция для отправки одного теста
async function runTest(test) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Тест: ${test.name}`);
  console.log(`${'='.repeat(60)}`);
  console.log('📤 Данные:', JSON.stringify(test.data, null, 2));
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test.data),
    });
    
    console.log(`📊 Статус: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📥 Ответ:', JSON.stringify(data, null, 2));
    
    // Проверка результата
    if (data.id) {
      console.log(`✅ Запись сохранена в БД с ID: ${data.id}`);
    } else {
      console.warn('⚠️  API не вернул ID записи');
    }
    
    if (data.issues) {
      if (data.issues.length > 0) {
        console.log(`🚨 Найдено ${data.issues.length} проблем(ы):`);
        data.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
      } else {
        console.log('✓ Проблем не найдено');
      }
    }
    
    return { success: true, id: data.id, issues: data.issues || [] };
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    return { success: false, error: error.message };
  }
}

// Запуск всех тестов последовательно
async function runAllTests() {
  console.log('\n🚀 Начинаем комплексное тестирование сохранения в БД');
  console.log(`API: ${API_URL}\n`);
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push({
      name: test.name,
      ...result
    });
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Итоговая статистика
  console.log(`\n${'='.repeat(60)}`);
  console.log('📈 ИТОГОВАЯ СТАТИСТИКА');
  console.log(`${'='.repeat(60)}\n`);
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const withIssues = results.filter(r => r.success && r.issues.length > 0).length;
  const recordIds = results.filter(r => r.success && r.id).map(r => r.id);
  
  console.log(`✅ Успешных запросов: ${successful}/${tests.length}`);
  console.log(`❌ Неудачных запросов: ${failed}/${tests.length}`);
  console.log(`🚨 Запросов с найденными проблемами: ${withIssues}/${successful}`);
  
  if (recordIds.length > 0) {
    console.log(`\n📝 ID сохраненных записей:`);
    recordIds.forEach(id => console.log(`   - ${id}`));
  }
  
  console.log('\n✅ Тестирование завершено!');
  
  // Рекомендации
  if (withIssues === 0 && successful > 0) {
    console.log('\n💡 Рекомендация: Все тесты прошли без обнаружения стоп-слов.');
    console.log('   Проверьте, что бэкенд корректно определяет стоп-слова.');
  }
}

// Запуск
runAllTests().catch(error => {
  console.error('\n💥 Критическая ошибка:', error);
  process.exit(1);
});
