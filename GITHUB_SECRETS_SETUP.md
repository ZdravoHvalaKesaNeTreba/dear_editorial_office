# Настройка GitHub Secrets для Production

Для работы приложения на GitHub Pages нужно настроить секретные переменные.

## Шаг 1: Откройте настройки репозитория

1. Зайдите на https://github.com/ZdravoHvalaKesaNeTreba/dear_editorial_office
2. Перейдите в **Settings** (⚙️)
3. В левом меню выберите **Secrets and variables** → **Actions**

## Шаг 2: Добавьте секреты

Нажмите **New repository secret** для каждого из следующих секретов:

### VITE_YANDEX_CLIENT_ID
- **Name**: `VITE_YANDEX_CLIENT_ID`
- **Value**: `be1ada40fb6a4d6a8193532a814c4a9d`
- Нажмите **Add secret**

### VITE_OAUTH_BACKEND_URL
- **Name**: `VITE_OAUTH_BACKEND_URL`  
- **Value**: (оставьте пустым сейчас, или добавьте URL после развертывания Cloud Function)
- Если оставляете пустым, просто введите пробел
- Нажмите **Add secret**

## Шаг 3: Проверьте workflow

После добавления секретов:

1. Сделайте любой коммит и push в main ветку
2. Зайдите во вкладку **Actions** в репозитории
3. Убедитесь, что workflow "Deploy to GitHub Pages" запустился
4. Дождитесь успешного завершения (зелёная галочка ✅)

## Шаг 4: Проверьте сайт

Откройте https://zdravohvalakesanetreba.github.io/dear_editorial_office/

Теперь:
- ✅ Кнопка "Проверить" должна работать
- ✅ Переменные окружения установлены
- ✅ Нет ошибок React error #31

## Обновление секретов

Если нужно обновить значение секрета:

1. Settings → Secrets and variables → Actions
2. Найдите нужный секрет
3. Нажмите кнопку редактирования (карандаш)
4. Введите новое значение
5. Сохраните

После изменения секрета нужно заново запустить workflow:
- Actions → выберите последний workflow → Re-run jobs

## Список всех секретов

| Секрет | Описание | Обязательный |
|--------|----------|--------------|
| `VITE_YANDEX_CLIENT_ID` | Client ID для Яндекс OAuth | Да |
| `VITE_OAUTH_BACKEND_URL` | URL Cloud Function для OAuth | Нет (пока) |

## Примечание

Переменные `VITE_API_URL` и `VITE_YANDEX_REDIRECT_URI` захардкожены в workflow файле (`.github/workflows/deploy.yml`), так как они не являются секретными и специфичны для production окружения.
