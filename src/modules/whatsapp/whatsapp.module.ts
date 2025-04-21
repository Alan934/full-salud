import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppProcessor } from './whatsapp.processor';
import { WhatsAppController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'whatsapp', // Name of the queue
    }),
  ],
  providers: [WhatsAppService, WhatsAppProcessor],
  exports: [WhatsAppService, WhatsAppProcessor],
  controllers: [WhatsAppController],
})
export class WhatsAppModule {}
