import * as migration_20241106_030511 from './20241106_030511';

export const migrations = [
  {
    up: migration_20241106_030511.up,
    down: migration_20241106_030511.down,
    name: '20241106_030511'
  },
];
