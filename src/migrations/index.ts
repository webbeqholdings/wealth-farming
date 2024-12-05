import * as migration_20241205_104255_create_telegram_table from './20241205_104255_create_telegram_table';

export const migrations = [
  {
    up: migration_20241205_104255_create_telegram_table.up,
    down: migration_20241205_104255_create_telegram_table.down,
    name: '20241205_104255_create_telegram_table'
  },
];
