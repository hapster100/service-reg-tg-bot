import { Shedulle } from "../models/Shedulle";
import { baseApiFetch } from "./base";

export async function getShedulle(year: number, month: number) {
  const res = await baseApiFetch('/shedulle', 'POST', {year, month})
  const { shedulle } = await res.json()
  return new Shedulle(shedulle)
}

export async function updateShedulle(year: number, month: number, shedulle: Shedulle) {
  return await baseApiFetch('/shedulle', 'PUT', {
    year,
    month,
    shedulle,
  })
}
