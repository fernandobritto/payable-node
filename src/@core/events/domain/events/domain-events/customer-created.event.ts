import Cpf from 'src/@core/common/domain/value-objects/cpf.vo'
import { CustomerId } from 'src/@core/events/domain/entities/customer.entity'
import { IDomainEvent } from 'src/@core/common/domain/domain-event'

export class CustomerCreated implements IDomainEvent {
  readonly event_version: number = 1
  readonly occurred_on: Date

  constructor(
    readonly aggregate_id: CustomerId,
    readonly name: string,
    readonly cpf: Cpf
  ) {
    this.occurred_on = new Date()
  }
}
