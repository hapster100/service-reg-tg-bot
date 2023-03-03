import { initParams } from "../stores/routes"

export type NoId<T> = Omit<T, 'id'>

const baseUrl = 'http://localhost:2025/api'

function getMasterId() {
  if (initParams.get('master_id') !== null) {
    document.cookie = initParams.get('master_id') as string
  }
  return document.cookie
}

export async function baseApiFetch(path: string, method = 'GET', body = {}, headers = {}) {
  const options : RequestInit = { method }


  options.headers = {
    'Content-Type': 'application/json',
    'X-Validation-Data': Telegram.WebApp.initData,
    'X-Master-Id': getMasterId(),
    ...headers,
  }
  
  if (method !== 'GET') {
    options.body = JSON.stringify(body) 
  }
  
  return fetch(baseUrl + path, options)
}
