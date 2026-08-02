# Сервис проверки URL

Серверная логика проверки URL на доступность.

## Запуск проекта

1. Клонировать репозиторий

```bash
git clone https://github.com/NVinox/urls-check-backend.git
```

2. Установить зависимости

```bash
npm install
```

3. Создать внешнюю сеть Docker (Для связи с фронтендом)

```bash
docker network create urls-check-network
```

4. Объявить переменные окружения (**.env.development.local** - для dev, **.env.production.local** - для prod)

```bash
cp .env.example .env.development.local && cp .env.example .env.production.local
```

5. Собрать и запустить Docker

   5.1 Режим development

   ```bash
    make dev
   ```

   5.2 Режим production

   ```bash
    make prod
   ```

6. Накатить миграции

   6.1 Режим development

   ```bash
    make mig-run
   ```

   6.2 Режим production

   ```bash
    make mig-run-prod
   ```

Сервис готов к работе.
