import * as migration_20241110_073737_init from './20241110_073737_init';
import * as migration_20241111_021949_update_global from './20241111_021949_update_global';
import * as migration_20241115_030718_add_new_column_to_users_table from './20241115_030718_add_new_column_to_users_table';

export const migrations = [
  {
    up: migration_20241110_073737_init.up,
    down: migration_20241110_073737_init.down,
    name: '20241110_073737_init',
  },
  {
    up: migration_20241111_021949_update_global.up,
    down: migration_20241111_021949_update_global.down,
    name: '20241111_021949_update_global',
  },
  {
    up: migration_20241115_030718_add_new_column_to_users_table.up,
    down: migration_20241115_030718_add_new_column_to_users_table.down,
    name: '20241115_030718_add_new_column_to_users_table'
  },
];
