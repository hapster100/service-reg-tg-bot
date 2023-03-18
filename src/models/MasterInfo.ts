export class MasterInfo {
  readonly address: string
  readonly successImageUrl: string
  readonly shedulleStep: number

  constructor({
    address,
    successImageUrl,
    shedulleStep
  }) {
    this.address = address || ''
    this.successImageUrl = successImageUrl || ''
    this.shedulleStep = shedulleStep || 15
  }
}