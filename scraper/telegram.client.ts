import { Api, TelegramClient as NativeTelegramClient } from "telegram";
import { IterMessagesParams } from "telegram/client/messages";
import { StringSession } from "telegram/sessions";
import fs from 'fs';
import path from 'path';

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
export class TelegramClient {
  private client: NativeTelegramClient;

  constructor() {
    this.client = new NativeTelegramClient(
      process.env.TELEGRAM_SESSION,
      process.env.TELEGRAM_API_ID,
      process.env.TELGRAM_API_HASH,
      {
        connectionRetries: 5,
      }
    );
  }

  async init(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('TelegramClient => init: ', error);
    }
    //await this.client.start({
    //  phoneNumber: async () =>
    //     new Promise((resolve) =>
    //       rl.question("Please enter your number: ", resolve)
    //     ),
    //   password: async () =>
    //     new Promise((resolve) =>
    //       rl.question("Please enter your password: ", resolve)
    //     ),
    //   phoneCode: async () =>
    //     new Promise((resolve) =>
    //       rl.question("Please enter the code you received: ", resolve)
    //     ),
    //
    //   onError: (err) => console.error(err),
    // });
    //
    // this.client.session.save();
  }

  async getJoinedChannels(): Promise<BigInteger[] | null> {
    try {
      const dialogs = await this.client.getDialogs();
      const channelsIds = dialogs.filter(d => d.isChannel).map(d => d.id);

      return channelsIds as unknown as BigInteger[];
    } catch (error) {
      console.log("Error in getJoinedChannels: ", error);
      return null;
    }
  }

  async fetchRecentMessages(channelId: BigInteger, filters: Partial<IterMessagesParams>): Promise<any[] | null> {

    try {


      const entity = await this.client.getEntity(channelId as unknown as number);
      const messages = await this.client.getMessages(entity, filters);

      return messages;
    } catch (error) {
      console.error('Error in fetchRecentMessages: ', error);
      return null;
    }
  }


  async downloadMedia(
    message: Api.Message
  ): Promise<Buffer | undefined | null | string> {
    if (!message.media || !message.message) {
      console.warn("⚠️ No media/message in message.");
      return null;
    }

    try {

      return await this.client.downloadMedia(message.media);

    } catch (error) {

      console.error("❌ Error downloading media:", error);
      return null;
    }
  }

  async disconnect() {
    return await this.client.disconnect();
  }

}
