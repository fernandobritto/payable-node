import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module'
import { HttpModule } from '@nestjs/axios/dist/http.module'
import { PaymentModel } from './entities/payment.entity'

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentModel]),
    HttpModule.register({
      baseURL: 'http://localhost:3001',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
