export class Feed {
  receiver_alias: string;
  sender_alias: string;
  timestamp: number;
  post: string;
  constructor(
    receiver_alias: string,
    sender_alias: string,
    timestamp: number,
    post: string
  ) {
    this.receiver_alias = receiver_alias;
    this.sender_alias = sender_alias;
    this.timestamp = timestamp;
    this.post = post;
  }
}
