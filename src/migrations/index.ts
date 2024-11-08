import * as migration_20241108_033940_init from './20241108_033940_init';

export const migrations = [
  {
    up: migration_20241108_033940_init.up,
    down: migration_20241108_033940_init.down,
    name: '20241108_033940_init'
  },
];
