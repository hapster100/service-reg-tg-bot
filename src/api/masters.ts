import { MasterInfo } from "../models/MasterInfo";
import { baseApiFetch } from "./base";

export async function getInfo() : Promise<MasterInfo> {
  const res = await baseApiFetch('/masters/info')
  const json = await res.json()
  return new MasterInfo({...json})
}

export async function updateInfo(info : MasterInfo) {
  const res = await baseApiFetch('/masters/info', 'PUT', {...info})
  return await res.json()
}
