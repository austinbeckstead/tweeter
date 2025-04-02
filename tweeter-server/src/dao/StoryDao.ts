import { DataPage } from "../entity/DataPage";
import { Story } from "../entity/Story";

export interface StoryDao {
  addStory(story: Story): Promise<void>;
  getPageOfStories(
    sender_alias: string,
    lastItem: number | undefined,
    limit: number
  ): Promise<DataPage<Story>>;
}
