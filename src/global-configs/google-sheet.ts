import { GlobalConfig } from 'payload'

const GcGoogleSheet: GlobalConfig = {
    slug: 'gc-google-sheet',
    label: 'Google Sheet',
    access: {
        read: () => true,
        update: () => true,
    },

    fields: [
        {
            name: 'appscript_url',
            type: 'text',
            label: 'Appscript Url',
            required: true,
            defaultValue: 'https://script.google.com/macros/s/AKfycbz_0J_D4C0GTlqY8zX5J76KBNueQzi8RWZRyvr3RxQYVttqq7oWdoWIrgJklnB7czT5/exec'
        },
        {
            name: 'sheet_list_user',
            type: 'text',
            label: 'List User',
            required: true,
            defaultValue: 'list_user'
        },
        {
            name: 'sheet_list_contract',
            type: 'text',
            label: 'List Contract',
            required: true,
            defaultValue: 'list_contract'
        },
        {
            name: 'sheet_list_transaction',
            type: 'text',
            label: 'List Transaction',
            required: true,
            defaultValue: 'list_transaction'
        },
        {
            name: 'sheet_highlight_overview',
            type: 'text',
            label: 'High Light Overview',
            required: true,
            defaultValue: 'highlight_overview'
        },
    ]

}

export default GcGoogleSheet