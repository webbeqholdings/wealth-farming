import * as migration_20241106_030511 from './20241106_030511';
import * as migration_20241108_022637_address from './20241108_022637_address';

export const migrations = [
  {
    up: migration_20241106_030511.up,
    down: migration_20241106_030511.down,
    name: '20241106_030511',
  },
  {
    up: migration_20241108_022637_address.up,
    down: migration_20241108_022637_address.down,
    name: '20241108_022637_address'
  },
];
