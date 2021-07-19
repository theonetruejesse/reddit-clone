import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

export const createUpvoteLoader = () =>
  new DataLoader<{postId: string; userId: string}, null | Upvote>(async (keys) => {
    const upvotes = await Upvote.findByIds(keys as any);
    const upvoteToUpvote: Record<string, Upvote> = {};
    upvotes.forEach((u) => {
      upvoteToUpvote[`${u.userId}|${u.postId}`] = u;
    });

    return keys.map((key) => upvoteToUpvote[`${key.userId}|${key.postId}`]);
  });
