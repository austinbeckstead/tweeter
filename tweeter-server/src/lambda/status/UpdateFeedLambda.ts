import { Feed } from "../../entity/Feed";
import { StatusService } from "../../model/service/StatusService";
const statusService = new StatusService();
export const handler = async (event: any) => {
  try {
    const records = event.Records;
    const feeds: Feed[] = records.map((record: any) => {
      const { receiver_alias, sender_alias, timestamp, post } = JSON.parse(
        record.body
      );
      console.log("FEED:");
      console.log(receiver_alias);
      return new Feed(receiver_alias, sender_alias, timestamp, post);
    });
    await statusService.addFeeds(feeds);
  } catch (error) {
    console.error("Error processing SQS message:", error);
  }
};
