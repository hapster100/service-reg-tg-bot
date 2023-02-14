import { baseApiFetch } from './base'

export interface ValidateResult {
  readonly result: boolean
}

export async function validate(initData: string) : Promise<ValidateResult> {
  return baseApiFetch('/validate', 'POST', { initData }).then(res => res.json())
}
