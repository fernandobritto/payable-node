import { Module } from '@nestjs/common'
import { PaymentsModule } from './payments/payments.module'
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module'
import { PaymentModel } from './payments/entities/payment.entity'

@Module({
  imports: [
    PaymentsModule,
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      host: ':memory:',
      autoLoadModels: true,
      models: [PaymentModel],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
