import { ObjectId } from "mongodb";

export class ImageProvider {
  constructor(mongoClient) {
    this.client = mongoClient;
    this.collection = mongoClient.db("image-gallery").collection("images");
  }

  async getAllImages() {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ];
    return await this.collection.aggregate(pipeline).toArray();
  }

  // API 1: Get one image by ID
  async getOneImage(imageId) {
    // 1. Check if the string is a valid MongoDB ObjectId first
    if (!ObjectId.isValid(imageId)) return null;

    const pipeline = [
      { $match: { _id: new ObjectId(imageId) } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ];

    const results = await this.collection.aggregate(pipeline).toArray();
    return results[0] || null;
  }

  // API 2: Update image name
  async updateImageName(imageId, newName) {
    if (!ObjectId.isValid(imageId)) return { matchedCount: 0 };

    const result = await this.collection.updateOne(
      { _id: new ObjectId(imageId) },
      { $set: { name: newName } },
    );

    // Lab 22a asks you to return the matchedCount
    return result.matchedCount;
  }
}
