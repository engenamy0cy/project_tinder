# Инструкция по запуску проекта

Этот проект состоит из двух частей: **Backend** (Django + Django Rest Framework) и **Frontend** (React Native / Expo).

---

## 1. Запуск Backend (Сервер)

Для работы бэкенда нужен Python (рекомендуется 3.10+).

1. Перейдите в папку `config`:
   ```bash
   cd config
   ```
2. Создайте виртуальное окружение и активируйте его:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux / Mac
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Примените миграции (создание базы данных SQLite):
   ```bash
   python manage.py migrate
   ```
5. Запустите сервер:
   ```bash
   python manage.py runserver
   ```
   Сервер будет доступен по адресу: `http://127.0.0.1:8000/`

---

## 2. Запуск Frontend (Веб/Приложение)

Для работы фронтенда нужен Node.js и npm.

1. Перейдите в папку `client`:
   ```bash
   cd client
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Проверьте адрес бэкенда в файле `src/lib/config.ts`. Там должен быть указан:
   `export const API_BASE_URL = "http://127.0.0.1:8000";`
4. Запустите веб-версию:
   ```bash
   npm run web
   ```
   После запуска откроется вкладка в браузере.

---

## Возможные проблемы

* **Ошибка 404 при запросе**: Проверьте, что в `users/urls.py` нет лишних префиксов (я их убрал, теперь пути `/users/user/login/` и `/users/user/register/`).
* **Ошибка 500**: Обычно означает ошибку в коде бэкенда. Проверьте консоль, где запущен `python manage.py runserver`.
* **CORS Error**: Если браузер блокирует запросы, убедитесь, что `django-cors-headers` настроен в `settings.py`.

---

## Основные изменения (что было исправлено)

1.  **Backend Auth**: Реализована логика в `users/views.py` (функции `login` и `register`). Раньше они были пустыми.
2.  **URLs**: Исправлены дублирующиеся префиксы в путях.
3.  **Frontend Context**: В `UserContext.tsx` добавлена нормальная обработка ошибок и логирование в консоль.
4.  **Comments**: В ключевые файлы добавлены комментарии на русском языке для упрощения понимания.
