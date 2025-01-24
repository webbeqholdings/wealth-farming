import * as migration_20241205_104255_create_telegram_table from './20241205_104255_create_telegram_table';
import * as migration_20241210_041714_add_notification_and_economic_calendar from './20241210_041714_add_notification_and_economic_calendar';
import * as migration_20241210_091236_add_field_product_overview from './20241210_091236_add_field_product_overview';
import * as migration_20241212_015324_create_seo_collection from './20241212_015324_create_seo_collection';
import * as migration_20241216_022626_create_main_menu_global from './20241216_022626_create_main_menu_global';
import * as migration_20241216_045325_add_column_amount_to_currency from './20241216_045325_add_column_amount_to_currency';
import * as migration_20241216_073305_create_user_referrals_collection from './20241216_073305_create_user_referrals_collection';
import * as migration_20241220_120738_create_withdrawl_contracts_and_payload_jobs_table from './20241220_120738_create_withdrawl_contracts_and_payload_jobs_table';
import * as migration_20241223_042430_drop_seo_and_add_enum_workflow from './20241223_042430_drop_seo_and_add_enum_workflow';
import * as migration_20241223_121532_delete_column_expected_return_in_contracts from './20241223_121532_delete_column_expected_return_in_contracts';
import * as migration_20241226_140744_update_fields_contracts_products_collection from './20241226_140744_update_fields_contracts_products_collection';
import * as migration_20241227_092241_add_field_message_in_withdrawl from './20241227_092241_add_field_message_in_withdrawl';
import * as migration_20241227_145926_detele_investment_profit_losses from './20241227_145926_detele_investment_profit_losses';
import * as migration_20241228_044639_create_table_gc_beq_dynamic_fund_and_add_enum_transactions from './20241228_044639_create_table_gc_beq_dynamic_fund_and_add_enum_transactions';
import * as migration_20241229_054012_create_payment_transfer_global from './20241229_054012_create_payment_transfer_global';
import * as migration_20241230_075829_create_crypto_wallets from './20241230_075829_create_crypto_wallets';
import * as migration_20241230_100602_add_fields_min_to_paymant_config from './20241230_100602_add_fields_min_to_paymant_config';
import * as migration_20241231_054938_add_column_deposit_screenshot_to_transaction from './20241231_054938_add_column_deposit_screenshot_to_transaction';
import * as migration_20250102_100344_add_columns_account_from_and_acount_to from './20250102_100344_add_columns_account_from_and_acount_to';
import * as migration_20250114_122714_add_field_message_to_transaction from './20250114_122714_add_field_message_to_transaction';
import * as migration_20250117_111708_add_columns_not_and_image_to_withdrawls from './20250117_111708_add_columns_not_and_image_to_withdrawls';
import * as migration_20250123_025853_add_account_to_and_account_from_to_transaction from './20250123_025853_add_account_to_and_account_from_to_transaction';

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
    name: '20241216_045325_add_column_amount_to_currency',
  },
  {
    up: migration_20241216_073305_create_user_referrals_collection.up,
    down: migration_20241216_073305_create_user_referrals_collection.down,
    name: '20241216_073305_create_user_referrals_collection',
  },
  {
    up: migration_20241220_120738_create_withdrawl_contracts_and_payload_jobs_table.up,
    down: migration_20241220_120738_create_withdrawl_contracts_and_payload_jobs_table.down,
    name: '20241220_120738_create_withdrawl_contracts_and_payload_jobs_table',
  },
  {
    up: migration_20241223_042430_drop_seo_and_add_enum_workflow.up,
    down: migration_20241223_042430_drop_seo_and_add_enum_workflow.down,
    name: '20241223_042430_drop_seo_and_add_enum_workflow',
  },
  {
    up: migration_20241223_121532_delete_column_expected_return_in_contracts.up,
    down: migration_20241223_121532_delete_column_expected_return_in_contracts.down,
    name: '20241223_121532_delete_column_expected_return_in_contracts',
  },
  {
    up: migration_20241226_140744_update_fields_contracts_products_collection.up,
    down: migration_20241226_140744_update_fields_contracts_products_collection.down,
    name: '20241226_140744_update_fields_contracts_products_collection',
  },
  {
    up: migration_20241227_092241_add_field_message_in_withdrawl.up,
    down: migration_20241227_092241_add_field_message_in_withdrawl.down,
    name: '20241227_092241_add_field_message_in_withdrawl',
  },
  {
    up: migration_20241227_145926_detele_investment_profit_losses.up,
    down: migration_20241227_145926_detele_investment_profit_losses.down,
    name: '20241227_145926_detele_investment_profit_losses',
  },
  {
    up: migration_20241228_044639_create_table_gc_beq_dynamic_fund_and_add_enum_transactions.up,
    down: migration_20241228_044639_create_table_gc_beq_dynamic_fund_and_add_enum_transactions.down,
    name: '20241228_044639_create_table_gc_beq_dynamic_fund_and_add_enum_transactions',
  },
  {
    up: migration_20241229_054012_create_payment_transfer_global.up,
    down: migration_20241229_054012_create_payment_transfer_global.down,
    name: '20241229_054012_create_payment_transfer_global',
  },
  {
    up: migration_20241230_075829_create_crypto_wallets.up,
    down: migration_20241230_075829_create_crypto_wallets.down,
    name: '20241230_075829_create_crypto_wallets',
  },
  {
    up: migration_20241230_100602_add_fields_min_to_paymant_config.up,
    down: migration_20241230_100602_add_fields_min_to_paymant_config.down,
    name: '20241230_100602_add_fields_min_to_paymant_config',
  },
  {
    up: migration_20241231_054938_add_column_deposit_screenshot_to_transaction.up,
    down: migration_20241231_054938_add_column_deposit_screenshot_to_transaction.down,
    name: '20241231_054938_add_column_deposit_screenshot_to_transaction',
  },
  {
    up: migration_20250102_100344_add_columns_account_from_and_acount_to.up,
    down: migration_20250102_100344_add_columns_account_from_and_acount_to.down,
    name: '20250102_100344_add_columns_account_from_and_acount_to',
  },
  {
    up: migration_20250114_122714_add_field_message_to_transaction.up,
    down: migration_20250114_122714_add_field_message_to_transaction.down,
    name: '20250114_122714_add_field_message_to_transaction',
  },
  {
    up: migration_20250117_111708_add_columns_not_and_image_to_withdrawls.up,
    down: migration_20250117_111708_add_columns_not_and_image_to_withdrawls.down,
    name: '20250117_111708_add_columns_not_and_image_to_withdrawls',
  },
  {
    up: migration_20250123_025853_add_account_to_and_account_from_to_transaction.up,
    down: migration_20250123_025853_add_account_to_and_account_from_to_transaction.down,
    name: '20250123_025853_add_account_to_and_account_from_to_transaction'
  },
];
