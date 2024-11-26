import * as migration_20241115_080955_init from './20241115_080955_init';
import * as migration_20241118_021129_posts from './20241118_021129_posts';
import * as migration_20241118_114724_TransferCashRequests from './20241118_114724_TransferCashRequests';
import * as migration_20241126_022151_investment_profit_loss_and_unit from './20241126_022151_investment_profit_loss_and_unit';

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
    name: '20241126_022151_investment_profit_loss_and_unit'
  },
];
