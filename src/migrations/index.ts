import * as migration_20241110_073737_init from './20241110_073737_init';

export const migrations = [
  {
    up: migration_20241110_073737_init.up,
    down: migration_20241110_073737_init.down,
    name: '20241110_073737_init'
  },
];
