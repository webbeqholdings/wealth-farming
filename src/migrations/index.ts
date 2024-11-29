import * as migration_20241115_080955_init from './20241115_080955_init';
import * as migration_20241118_021129_posts from './20241118_021129_posts';
import * as migration_20241118_114724_TransferCashRequests from './20241118_114724_TransferCashRequests';
import * as migration_20241126_022151_investment_profit_loss_and_unit from './20241126_022151_investment_profit_loss_and_unit';
import * as migration_20241128_095214_add_fields_to_address_media_users_collection from './20241128_095214_add_fields_to_address_media_users_collection';
import * as migration_20241129_061229_add_fields_media_and_posts from './20241129_061229_add_fields_media_and_posts';
import * as migration_20241129_090500_add_start_date_and_end_date_to_products from './20241129_090500_add_start_date_and_end_date_to_products';

export const migrations = [
  {
    up: migration_20241115_080955_init.up,
    down: migration_20241115_080955_init.down,
    name: '20241115_080955_init',
  },
  {
    up: migration_20241118_021129_posts.up,
    down: migration_20241118_021129_posts.down,
    name: '20241118_021129_posts',
  },
  {
    up: migration_20241118_114724_TransferCashRequests.up,
    down: migration_20241118_114724_TransferCashRequests.down,
    name: '20241118_114724_TransferCashRequests',
  },
  {
    up: migration_20241126_022151_investment_profit_loss_and_unit.up,
    down: migration_20241126_022151_investment_profit_loss_and_unit.down,
    name: '20241126_022151_investment_profit_loss_and_unit',
  },
  {
    up: migration_20241128_095214_add_fields_to_address_media_users_collection.up,
    down: migration_20241128_095214_add_fields_to_address_media_users_collection.down,
    name: '20241128_095214_add_fields_to_address_media_users_collection',
  },
  {
    up: migration_20241129_061229_add_fields_media_and_posts.up,
    down: migration_20241129_061229_add_fields_media_and_posts.down,
    name: '20241129_061229_add_fields_media_and_posts',
  },
  {
    up: migration_20241129_090500_add_start_date_and_end_date_to_products.up,
    down: migration_20241129_090500_add_start_date_and_end_date_to_products.down,
    name: '20241129_090500_add_start_date_and_end_date_to_products'
  },
];
