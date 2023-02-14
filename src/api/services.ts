import { Service } from "../models/Service"
import { baseApiFetch, type NoId } from "./base"


export async function getAllServices(): Promise<Service[]> {
  const res = await baseApiFetch('/services')
  const json = await res.json()
  return json.services.map(raw => new Service(raw))
}

export async function getServiceById(id: string): Promise<Service> {
  const res = await baseApiFetch('/services/' + id)
  const json = await res.json()
  return new Service(json)
}

export async function addService(service: NoId<Service>) {
  const body = { service }
  return await baseApiFetch('/services', 'POST', body)
}
