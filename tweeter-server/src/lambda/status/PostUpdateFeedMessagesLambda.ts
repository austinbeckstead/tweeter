import { Story } from "../../entity/Story";
import { StatusService } from "../../model/service/StatusService";
const statusService = new StatusService();
export const handler = async (event: any) => {
  for (const record of event.Records) {
    try {
      const { sender_alias, timestamp, post } = JSON.parse(record.body);
      const story = new Story(sender_alias, timestamp, post);
      await statusService.postStatus(story);
    } catch (error) {
      console.error("Error processing SQS message:", error);
    }
  }
};
