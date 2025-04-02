export class Story {
  sender_alias: string;
  timestamp: number;
  post: string;
  constructor(sender_alias: string, timestamp: number, post: string) {
    this.sender_alias = sender_alias;
    this.timestamp = timestamp;
    this.post = post;
  }
}
