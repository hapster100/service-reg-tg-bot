export class MasterInfo {
  readonly address: string
  readonly successImageUrl: string

  constructor({
    address,
    successImageUrl,
  }) {
    this.address = address || ''
    this.successImageUrl = successImageUrl || ''
  }
}