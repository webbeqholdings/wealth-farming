import * as migration_20241205_104255_create_telegram_table from './20241205_104255_create_telegram_table';
import * as migration_20241210_041714_add_notification_and_economic_calendar from './20241210_041714_add_notification_and_economic_calendar';

export const migrations = [
  {
    up: migration_20241205_104255_create_telegram_table.up,
    down: migration_20241205_104255_create_telegram_table.down,
    name: '20241205_104255_create_telegram_table',
  },
  {
    up: migration_20241210_041714_add_notification_and_economic_calendar.up,
    down: migration_20241210_041714_add_notification_and_economic_calendar.down,
    name: '20241210_041714_add_notification_and_economic_calendar'
  },
];
