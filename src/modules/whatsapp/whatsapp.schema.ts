import { Schema, model } from 'mongoose';

const WhatsAppSessionSchema = new Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'session' or 'cache'
  data: { type: Buffer, required: true }, // Binary data for the session or cache
});

export const WhatsAppSession = model('WhatsAppSession', WhatsAppSessionSchema);