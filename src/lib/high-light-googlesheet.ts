'use server'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({
    config,
})


export const gcSheet = async () => {
    const response = await payload.findGlobal({
        slug: 'gc-google-sheet',
    })

    return response
}

export const getUsers = async () => {
    const sheetCongfig = await gcSheet()
    const urlSheet = sheetCongfig.appscript_url + `?sheet=${sheetCongfig.sheet_list_user}`
    const response = await fetch(urlSheet)
    const data = await response.json()

    return data
}

export const getContracts = async () => {
    const sheetCongfig = await gcSheet()
    const urlSheet = sheetCongfig.appscript_url + `?sheet=${sheetCongfig.sheet_list_contract}`
    const response = await fetch(urlSheet)
    const data = await response.json()

    return data
}

export const getTransactions = async () => {
    const sheetCongfig = await gcSheet()
    const urlSheet = sheetCongfig.appscript_url + `?sheet=${sheetCongfig.sheet_list_transaction}`
    const response = await fetch(urlSheet)
    const data = await response.json()

    return data
}

export const getOverview = async () => {
    const sheetCongfig = await gcSheet()
    const urlSheet = sheetCongfig.appscript_url + `?sheet=${sheetCongfig.sheet_highlight_overview}`
    const response = await fetch(urlSheet)
    const data = await response.json()

    return data
}