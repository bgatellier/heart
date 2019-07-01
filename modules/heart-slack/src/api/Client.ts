import { WebClient } from '@slack/web-api';

/**
 * Simple Slack client:
 * Initialize a Slack client using:
 * - the SLACK_API_TOKEN process.env property
 * - the SLACK_CHANNEL_ID process.env property
 */
export default class Client {
  private channel: string;
  private client: WebClient;

  constructor() {
    this.channel = process.env.SLACK_CHANNEL_ID;
    this.client = new WebClient(process.env.SLACK_API_TOKEN);
  }

  public async postMessage(text: string): Promise<any> {
    return this.client.chat.postMessage({channel: this.channel, text});
  }
}
