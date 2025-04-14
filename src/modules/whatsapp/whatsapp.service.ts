// import { Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { Client, LocalAuth } from 'whatsapp-web.js';
// import { WhatsAppSession } from './whatsapp.schema'; // Import the session schema
// import * as fs from 'fs';

// @Injectable()
// export class WhatsAppService {
//   private client: Client;

//   constructor(private eventEmitter: EventEmitter2) {
//     this.downloadSessionFromMongo()
//       .then(() => {
//         console.log('Session data loaded from MongoDB.');
//         this.initializeClient();
//       })
//       .catch((error) => {
//         console.error('Error loading session data from MongoDB:', error.message);
//         this.initializeClient(); // Initialize client even if session data is not available
//       });
//   }

//   // Initialize the WhatsApp Web client
//   private initializeClient(): void {
//     this.client = new Client({
//       authStrategy: new LocalAuth({
//         clientId: 'default',
//         dataPath: './.wwebjs_auth',
//       }),
//       puppeteer: {
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//         protocolTimeout: 600000,
//       },
//     });

//     this.client.on('qr', (qr) => {
//       this.eventEmitter.emit('qrcode.created', qr);
//     });

//     this.client.on('ready', () => {
//       console.log('WhatsApp Web client is ready!');
//     });

//     this.client.on('authenticated', async () => {
//       console.log('WhatsApp Web client authenticated!');
//       await this.uploadSessionToMongo();
//     });

//     this.client.initialize();
//   }

//   // Upload session data to MongoDB
//   private async uploadSessionToMongo(): Promise<void> {
//     try {
//       const sessionPath = './.wwebjs_auth/session-default';
//       const cachePath = './.wwebjs_auth/cache';

//       // Read session and cache files
//       const sessionData = await fs.promises.readFile(sessionPath);
//       const cacheData = await fs.promises.readFile(cachePath);

//       // Save session data to MongoDB
//       await WhatsAppSession.updateOne(
//         { key: 'session' },
//         { data: sessionData },
//         { upsert: true }
//       );

//       // Save cache data to MongoDB
//       await WhatsAppSession.updateOne(
//         { key: 'cache' },
//         { data: cacheData },
//         { upsert: true }
//       );

//       console.log('WhatsApp session data uploaded to MongoDB.');
//     } catch (error) {
//       console.error('Error uploading session data to MongoDB:', (error as Error).message);
//     }
//   }

//   // Download session data from MongoDB
//   private async downloadSessionFromMongo(): Promise<void> {
//     try {
//       const sessionPath = './.wwebjs_auth/session-default';
//       const cachePath = './.wwebjs_auth/cache';

//       // Retrieve session data from MongoDB
//       const session = await WhatsAppSession.findOne({ key: 'session' });
//       const cache = await WhatsAppSession.findOne({ key: 'cache' });

//       if (session && cache) {
//         // Write session and cache data to local files
//         await fs.promises.writeFile(sessionPath, session.data);
//         await fs.promises.writeFile(cachePath, cache.data);

//         console.log('WhatsApp session data downloaded from MongoDB.');
//       } else {
//         console.log('No session data found in MongoDB.');
//       }
//     } catch (error) {
//       console.error('Error downloading session data from MongoDB:', (error as Error).message);
//     }
//   }

//   // Send a WhatsApp message
//   async sendMessage(to: string, message: string): Promise<void> {
//     try {
//       const finalNumber = `54${to}`; // Add the country code to the number
//       const numberDetails = await this.client.getNumberId(finalNumber);

//       if (!numberDetails) {
//         throw new Error(`The phone number ${to} is not registered on WhatsApp.`);
//       }

//       await this.client.sendMessage(numberDetails._serialized, message);
//       console.log(`WhatsApp message sent to ${to}: ${message}`);
//     } catch (error) {
//       console.error('Error sending WhatsApp message:', (error as Error).message);
//       throw error;
//     }
//   }

//   // Disconnect the client and clean up
//   async disconnect(): Promise<void> {
//     try {
//       await this.client.logout();
//       console.log('WhatsApp Web client disconnected.');
//     } catch (error) {
//       console.error('Error disconnecting WhatsApp client:', (error as Error).message);
//     }
//   }
// }