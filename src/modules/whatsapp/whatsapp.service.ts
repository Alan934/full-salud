import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsAppService {
  private logger = new Logger(WhatsAppService.name);

  constructor(private readonly httpService: HttpService) {}

  async getQRCode() {
    const externalQrEndpoint = 'https://fullsalud-productomonolito-production.up.railway.app/api/bot/qrcode/4'
    this.logger.log(`Fetching QR code image from ${externalQrEndpoint}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(externalQrEndpoint, {
          responseType: 'arraybuffer', // Crucial: Tell Axios to expect binary data
        }),
      );

      // Get content type from response headers
      const contentType = response.headers['content-type'] || 'image/png'; // Default if missing
      this.logger.log(`Successfully fetched QR code image. Content-Type: ${contentType}`);

      // Axios returns the ArrayBuffer in response.data when responseType is 'arraybuffer'
      // Convert ArrayBuffer to Node.js Buffer
      const imageBuffer = Buffer.from(response.data);

      // Return the buffer and content type
      return { buffer: imageBuffer, contentType: contentType };

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(
          `Error fetching QR code image: Status ${axiosError.response.status}`,
          axiosError.stack,
          // Log response data if it's not binary or convert binary safely
          Buffer.isBuffer(axiosError.response.data) ? '<Binary Data>' : JSON.stringify(axiosError.response.data)
        );
      } else if (axiosError.request) {
        this.logger.error(
          `Error fetching QR code image: No response received from ${externalQrEndpoint}`,
          axiosError.stack,
        );
      } else {
        this.logger.error(
          `Error fetching QR code image: Request setup failed - ${axiosError.message}`,
          axiosError.stack,
        );
      }
      // Return null or throw a more specific error
      // throw new Error(`Failed to fetch QR code image from external endpoint: ${axiosError.message}`);
      return null; // Indicate failure by returning null
    }
  }

  async sendMessage(to: string, message: string): Promise<void> {
    // Base URL of the external endpoint
    const baseUrl = 'https://fullsalud-productomonolito-production.up.railway.app/api/bot/send-message';

    // Encode parameters for safe inclusion in URL
    const encodedTo = encodeURIComponent(to);
    const encodedMessage = encodeURIComponent(message);

    // Construct the full URL with query parameters
    const externalUrl = `${baseUrl}?to=${encodedTo}&message=${encodedMessage}`;

    this.logger.log(`Sending message via POST to: ${externalUrl}`);

    try {
      // Make the POST request. Send null as the body since data is in query params.
      // We expect an empty response body on success (status 201).
      const response = await firstValueFrom(
        this.httpService.post(externalUrl, {}, { // Send null or {} as body
          // Optional: Set headers if required by the endpoint
          headers: { 'Accept': '*/*' },
          timeout: 15000,
        }),
      );

      // Check for successful status codes (e.g., 200, 201, 204)
      if (response.status >= 200 && response.status < 300) {
        this.logger.log(`Successfully sent message request to external endpoint. Status: ${response.status}`);
        // No specific action needed for empty body success
      } else {
        // Handle unexpected success status codes if necessary
        this.logger.warn(`External endpoint returned unexpected success status: ${response.status}`);
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(
          `Error sending message request: Status ${axiosError.response.status}, Data: ${JSON.stringify(axiosError.response.data)}`,
          axiosError.stack,
        );
      } else if (axiosError.request) {
        this.logger.error(
          `Error sending message request: No response received from ${externalUrl}`,
          axiosError.stack,
        );
      } else {
        this.logger.error(
          `Error sending message request: Request setup failed - ${axiosError.message}`,
          axiosError.stack,
        );
      }
      // Re-throw the error to be handled by the controller
      throw new Error(`Failed to send message via external endpoint: ${axiosError.message}`);
    }
  }

  async disconnect(): Promise<void> {
    const externalUrl = 'https://fullsalud-productomonolito-production.up.railway.app/api/bot/disconnect';
    this.logger.log(`Sending disconnect request via POST to: ${externalUrl}`);

    try {
      // Make the POST request with no body.
      // Expecting a successful response (e.g., 200 OK or 204 No Content).
      const response = await firstValueFrom(
        this.httpService.post(externalUrl, null, { // Send null or {} as body
          // Optional: Set headers if required
        }),
      );

      // Check for successful status codes
      if (response.status >= 200 && response.status < 300) {
        this.logger.log(`Successfully sent disconnect request to external endpoint. Status: ${response.status}`);
      } else {
        this.logger.warn(`External disconnect endpoint returned unexpected success status: ${response.status}`);
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        this.logger.error(
          `Error sending disconnect request: Status ${axiosError.response.status}, Data: ${JSON.stringify(axiosError.response.data)}`,
          axiosError.stack,
        );
      } else if (axiosError.request) {
        this.logger.error(
          `Error sending disconnect request: No response received from ${externalUrl}`,
          axiosError.stack,
        );
      } else {
        this.logger.error(
          `Error sending disconnect request: Request setup failed - ${axiosError.message}`,
          axiosError.stack,
        );
      }
      // Re-throw the error to be handled by the controller
      throw new Error(`Failed to send disconnect request via external endpoint: ${axiosError.message}`);
    }
  }
}
