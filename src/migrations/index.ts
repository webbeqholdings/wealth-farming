import * as migration_20241115_080955_init from './20241115_080955_init';

export const migrations = [
  {
    up: migration_20241115_080955_init.up,
    down: migration_20241115_080955_init.down,
    name: '20241115_080955_init'
  },
];
