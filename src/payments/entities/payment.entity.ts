import { Column, Model, Table } from 'sequelize-typescript'

export type PaymentAttributes = {
  amount: number
  currency: string
  status: string
}

@Table
export class PaymentModel extends Model<PaymentAttributes> {
  @Column
  amount: number

  @Column
  currency: string

  @Column
  status: string
}
