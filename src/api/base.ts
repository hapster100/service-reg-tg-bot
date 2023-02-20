export type NoId<T> = Omit<T, 'id'>

const baseUrl = 'http://178.185.109.211:2025/api'

export async function baseApiFetch(path: string, method = 'GET', body = {}, headers = {}) {
  const options : RequestInit = { method }

  options.headers = {
    'Content-Type': 'application/json',
    'X-Validation-Data': Telegram.WebApp.initData,
    ...headers,
  }
  
  if (method !== 'GET') {
    options.body = JSON.stringify(body) 
  }
  
  return fetch(baseUrl + path, options)
}
