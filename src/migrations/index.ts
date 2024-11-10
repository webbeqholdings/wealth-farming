import * as migration_20241110_053004_init from './20241110_053004_init';

export const migrations = [
  {
    up: migration_20241110_053004_init.up,
    down: migration_20241110_053004_init.down,
    name: '20241110_053004_init'
  },
];
