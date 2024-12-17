import { Injectable } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { PaymentModel } from './entities/payment.entity'
import { HttpService } from '@nestjs/axios'
import { InjectModel } from '@nestjs/sequelize'
import { lastValueFrom } from 'rxjs/internal/lastValueFrom'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(PaymentModel)
    private paymentModel: typeof PaymentModel,
    private httpService: HttpService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentModel.create(createPaymentDto)
    lastValueFrom(
      this.httpService.post('payments', {
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      }),
    )
    return payment
  }

  findAll() {
    return this.paymentModel.findAll()
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`
  }

  remove(id: number) {
    return `This action removes a #${id} payment`
  }
}
