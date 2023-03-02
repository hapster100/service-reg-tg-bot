import { initParams } from "../stores/routes"

export type NoId<T> = Omit<T, 'id'>

const baseUrl = 'http://localhost:2025/api'

export async function baseApiFetch(path: string, method = 'GET', body = {}, headers = {}) {
  const options : RequestInit = { method }

  options.headers = {
    'Content-Type': 'application/json',
    'X-Validation-Data': Telegram.WebApp.initData,
    'X-Master-Id': initParams.get('master_id') || 'test_master',
    ...headers,
  }
  
  if (method !== 'GET') {
    options.body = JSON.stringify(body) 
  }
  
  return fetch(baseUrl + path, options)
}
