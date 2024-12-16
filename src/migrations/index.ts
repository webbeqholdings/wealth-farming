import * as migration_20241205_104255_create_telegram_table from './20241205_104255_create_telegram_table';
import * as migration_20241210_041714_add_notification_and_economic_calendar from './20241210_041714_add_notification_and_economic_calendar';
import * as migration_20241210_091236_add_field_product_overview from './20241210_091236_add_field_product_overview';
import * as migration_20241212_015324_create_seo_collection from './20241212_015324_create_seo_collection';
import * as migration_20241216_022626_create_main_menu_global from './20241216_022626_create_main_menu_global';
import * as migration_20241216_045325_add_column_amount_to_currency from './20241216_045325_add_column_amount_to_currency';

export const migrations = [
  {
    up: migration_20241205_104255_create_telegram_table.up,
    down: migration_20241205_104255_create_telegram_table.down,
    name: '20241205_104255_create_telegram_table',
  },
  {
    up: migration_20241210_041714_add_notification_and_economic_calendar.up,
    down: migration_20241210_041714_add_notification_and_economic_calendar.down,
    name: '20241210_041714_add_notification_and_economic_calendar',
  },
  {
    up: migration_20241210_091236_add_field_product_overview.up,
    down: migration_20241210_091236_add_field_product_overview.down,
    name: '20241210_091236_add_field_product_overview',
  },
  {
    up: migration_20241212_015324_create_seo_collection.up,
    down: migration_20241212_015324_create_seo_collection.down,
    name: '20241212_015324_create_seo_collection',
  },
  {
    up: migration_20241216_022626_create_main_menu_global.up,
    down: migration_20241216_022626_create_main_menu_global.down,
    name: '20241216_022626_create_main_menu_global',
  },
  {
    up: migration_20241216_045325_add_column_amount_to_currency.up,
    down: migration_20241216_045325_add_column_amount_to_currency.down,
    name: '20241216_045325_add_column_amount_to_currency'
  },
];
