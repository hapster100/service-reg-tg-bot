import { initParams } from "../stores/routes"

export type NoId<T> = Omit<T, 'id'>

export interface Success {
  success: boolean
} 

const baseUrl = import.meta.env.VITE_API_URL

function getMasterId() {
  if (initParams.get('master_id') !== null) {
    localStorage.setItem('master_id', initParams.get('master_id') as string)
  }
  return localStorage.getItem('master_id') || 'test'
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
