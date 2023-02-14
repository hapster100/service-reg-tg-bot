export type NoId<T> = Omit<T, 'id'>

const baseUrl = 'https://localhost:8080/api'

export async function baseApiFetch(path, method = 'GET', body = {}, headers = {}) {
  const options : RequestInit = { method }
  if (method !== 'GET') {
    options.body = JSON.stringify(body) 
    options.headers = {
      'Content-Type': 'application/json',
      ...headers,
    }
  }
  return fetch(baseUrl + path, options)
}
