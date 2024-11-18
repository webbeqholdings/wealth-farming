import * as migration_20241115_080955_init from './20241115_080955_init';
import * as migration_20241118_013933_posts from './20241118_013933_posts';

export const migrations = [
  {
    up: migration_20241115_080955_init.up,
    down: migration_20241115_080955_init.down,
    name: '20241115_080955_init',
  },
  {
    up: migration_20241118_013933_posts.up,
    down: migration_20241118_013933_posts.down,
    name: '20241118_013933_posts'
  },
];
