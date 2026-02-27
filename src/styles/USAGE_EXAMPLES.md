# Примеры использования Яндекс компонентов

## Типографика

### Заголовки

```tsx
// Title 1 (54px/60px)
<h1>Селф-сервис проверки текстов</h1>

// Title 2 (34px/40px)
<h2>Для кого этот сервис</h2>

// Обычный текст (18px/28px)
<p>Этот сервис проверяет тексты на соответствие требованиям</p>
```

## Кнопки

### Первичная кнопка (желтая)

```tsx
<button className="px-8 py-3 bg-[#FC0] hover:bg-[#FFD633] rounded-2xl font-medium text-[#191E28] transition-all">
  Проверить
</button>
```

### Вторичная кнопка (прозрачная)

```tsx
<button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 rounded-2xl text-white transition-all">
  Выбрать сервис
</button>
```

## Карточки

### Белая карточка

```tsx
<div className="bg-white rounded-[32px] p-8 shadow-lg hover:transform hover:-translate-y-1 transition-all">
  <h2 className="text-[#191E28] font-['YS_Display'] font-bold text-[34px] leading-[40px]">
    Заголовок карточки
  </h2>
  <p className="text-[#5F6466] font-['YS_Text'] text-[18px] leading-[28px] mt-4">
    Описание карточки
  </p>
</div>
```

### Карточка на темном фоне

```tsx
<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
  <h3 className="text-white font-medium">Заголовок</h3>
  <p className="text-[#DDC8FF] mt-2">Описание</p>
</div>
```

## Цвета

### CSS классы

```tsx
// Фоны
<div className="bg-[#191E28]">Темный фон</div>
<div className="bg-[#FC0]">Желтый фон</div>
<div className="bg-white">Белый фон</div>

// Текст
<p className="text-[#191E28]">Основной текст</p>
<p className="text-[#5F6466]">Второстепенный текст</p>
<p className="text-[#DDC8FF]">Светлый текст на темном</p>
<p className="text-[#FC0]">Желтый акцент</p>
```

### CSS переменные

```css
.element {
  color: var(--yandex-black);
  background: var(--yandex-yellow);
  font-family: var(--font-family-display);
}
```

## Inputs и Textarea

### Textarea с границей

```tsx
<textarea 
  className="w-full h-64 bg-gray-50 rounded-[24px] border-2 border-gray-200 p-8 resize-none outline-none font-['YS_Text'] placeholder:text-gray-400"
  placeholder="Введите текст..."
/>
```

### Input с состояниями

```tsx
// Нормальное состояние
<input className="border-2 border-gray-200 rounded-2xl px-4 py-3" />

// Успех
<input className="border-2 border-green-400 rounded-2xl px-4 py-3" />

// Ошибка
<input className="border-2 border-red-400 rounded-2xl px-4 py-3" />
```

## Секции

### Секция с темным фоном

```tsx
<section className="bg-[#191E28] py-16">
  <div className="max-w-7xl mx-auto px-8">
    <h1 className="text-white mb-6">Заголовок секции</h1>
    <p className="text-[#DDC8FF]">Описание секции</p>
  </div>
</section>
```

### Секция с градиентом

```tsx
<section className="bg-gradient-to-b from-[#191E28] to-[#21272E] py-16">
  {/* Контент */}
</section>
```

## Навигация и ссылки

### Ссылки

```tsx
// Желтая ссылка
<a href="#" className="text-[#FC0] hover:text-[#FFD633] transition-colors font-medium">
  Ссылка
</a>

// Белая ссылка на темном фоне
<a href="#" className="text-white hover:text-[#FC0] transition-colors">
  Ссылка
</a>
```

## Иконки

### С фоном

```tsx
// Успех
<div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
  <Check className="w-8 h-8 text-green-600" />
</div>

// Ошибка
<div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
  <AlertCircle className="w-8 h-8 text-red-500" />
</div>
```

## Анимации

### Hover эффекты

```tsx
// Подъем при hover
<div className="hover:-translate-y-1 transition-transform">
  Контент
</div>

// Изменение тени
<div className="shadow-sm hover:shadow-lg transition-shadow">
  Контент
</div>

// Изменение цвета
<button className="bg-[#FC0] hover:bg-[#FFD633] transition-colors">
  Кнопка
</button>
```

### Fade in анимация

```tsx
<div className="animate-fade-in-up">
  Контент с анимацией появления
</div>
```

## Responsive дизайн

### Breakpoints

```tsx
<div className="
  px-4 md:px-8 lg:px-12      // Отступы
  text-base md:text-lg        // Размер текста
  grid-cols-1 lg:grid-cols-2  // Сетка
">
  Контент
</div>
```

## Утилитарные классы из yandex.css

```tsx
// Кнопки
<button className="btn-yandex btn-yandex-primary">Первичная</button>
<button className="btn-yandex btn-yandex-secondary">Вторичная</button>

// Карточки
<div className="card-yandex">Карточка с hover эффектом</div>

// Типографика
<h1 className="text-yandex-title1">Большой заголовок</h1>
<h2 className="text-yandex-title2">Средний заголовок</h2>
<p className="text-yandex-body">Основной текст</p>

// Цвета фона
<div className="bg-yandex-yellow">Желтый фон</div>
<div className="bg-yandex-black">Черный фон</div>
<div className="bg-yandex-dark">Темный фон</div>

// Цвета текста
<p className="text-yandex-yellow">Желтый текст</p>
<p className="text-yandex-purple-light">Светло-фиолетовый</p>
<p className="text-yandex-gray">Серый текст</p>

// Градиенты
<div className="gradient-yandex-dark">Темный градиент</div>
```
