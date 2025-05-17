import { Controller, Get, Res, Param, Post, HttpCode, HttpException, HttpStatus, Query } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Controller('bot')
export class WhatsAppController {
  constructor(private whatsAppService: WhatsAppService) {}

  @Get('qrcode')
  async getQRCode(@Res() res) {
    const qrCode = await this.whatsAppService.getQRCode();
    if (qrCode) {
      res.setHeader('Content-Type', qrCode.contentType);
      res.send(qrCode.buffer);
    } else {
      res.status(500).send('Error fetching QR code image');
    }
  }
  @Post('send-message')
  @HttpCode(HttpStatus.OK) // Set default success status to 200 OK for POST
  async sendMessage(
    @Query('to') to: string,
    @Query('message') message: string,
  ) {
    // Basic validation
    if (!to || !message) {
      throw new HttpException('Missing required query parameters: "to" and "message"', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.whatsAppService.sendMessage(to, message);
      // Return a success response if the service call doesn't throw
      return { success: true, message: 'Message send request processed.' };
    } catch (error) {
      // Catch errors from the service (e.g., external POST failed, WhatsApp send failed)
      throw new HttpException(
        (error as Error).message || 'Failed to send message',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('disconnect')
  @HttpCode(HttpStatus.OK) // Set default success status to 200 OK
  async disconnect() {
    try {
      await this.whatsAppService.disconnect();
      return { success: true, message: 'Disconnect request processed.' };
    } catch (error) {
      // Catch errors from the service
      throw new HttpException(
        (error as Error).message || 'Failed to process disconnect request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
