import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const baseUrl = 'https://fullsalud-productomonolito-production.up.railway.app/api/bot/send-message';
    const encodedTo = encodeURIComponent(to);
    const encodedMessage = encodeURIComponent(message);
    const externalUrl = `${baseUrl}?to=${encodedTo}&message=${encodedMessage}`;

    const maxRetries = 5; // Maximum number of retry attempts
    const retryDelayMs = 2000; // Delay between retries in milliseconds (e.g., 2 seconds)

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.logger.log(`Sending message via POST to: ${externalUrl} (Attempt ${attempt}/${maxRetries})`);
      try {
        const response = await firstValueFrom(
          this.httpService.post(externalUrl, {}, {
            headers: { 'Accept': '*/*' },
            timeout: 15000, // Keep timeout for individual attempts
          }),
        );

        // Check for successful status codes (200-299)
        if (response.status >= 200 && response.status < 300) {
          this.logger.log(`Successfully sent message request. Status: ${response.status} (Attempt ${attempt})`);
          return; // Success, exit the function
        } else {
          // Handle unexpected success status codes if necessary
          this.logger.warn(`External endpoint returned non-error but non-success status: ${response.status} (Attempt ${attempt})`);
          // Decide if this case should retry or exit. Let's retry for now.
          // If it should exit, you could 'return;' here.
        }

      } catch (error) {
        const axiosError = error as AxiosError;
        this.logger.error(`Attempt ${attempt} failed. Code: ${axiosError.code}`);

        if (axiosError.response) {
          this.logger.error(
            `Error sending message request: Status ${axiosError.response.status}, Data: ${JSON.stringify(axiosError.response.data)}`,
            axiosError.stack, // Keep stack trace for detailed debugging
          );
        } else if (axiosError.request) {
          this.logger.error(
            `Error sending message request: No response received from ${externalUrl}. Code: ${axiosError.code}`,
            // No stack trace needed here as it's less informative for network issues
          );
        } else {
          this.logger.error(
            `Error sending message request: Request setup failed - ${axiosError.message}`,
            axiosError.stack,
          );
        }

        // If it's the last attempt, throw the error to signal final failure
        if (attempt === maxRetries) {
          this.logger.error(`Max retries (${maxRetries}) reached. Giving up.`);
          throw new Error(`Failed to send message via external endpoint after ${maxRetries} attempts: ${axiosError.message} (Last Code: ${axiosError.code})`);
        }

        // Wait before the next retry
        this.logger.log(`Waiting ${retryDelayMs}ms before next attempt...`);
        await delay(retryDelayMs);

      } // End catch block
    } // End for loop
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
