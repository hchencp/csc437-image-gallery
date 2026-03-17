import { ObjectId } from "mongodb";

export class ImageProvider {
  constructor(mongoClient) {
    this.client = mongoClient;
    // Note: Using the db name from your .env for consistency
    this.db = mongoClient.db("image-gallery");
    this.collection = this.db.collection("images");
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

  async getOneImage(imageId) {
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

  async updateImageName(imageId, newName) {
    if (!ObjectId.isValid(imageId)) return 0;

    const result = await this.collection.updateOne(
      { _id: new ObjectId(imageId) },
      { $set: { name: newName } },
    );

    return result.matchedCount;
  }

  /**
   * Lab 24: Create a new image document in the database
   */
  async createImage(name, filename, username) {
    // 1. Find the user in the 'users' collection to get their _id
    // This ensures the $lookup in getAllImages/getOneImage actually works!
    const user = await this.db
      .collection("users")
      .findOne({ username: username });

    if (!user) {
      throw new Error("User not found");
    }

    const newImage = {
      name: name,
      src: `/uploads/${filename}`,
      author: user._id, // Store the ObjectId, not the username string
    };

    const result = await this.collection.insertOne(newImage);

    // Return the string version of the new ID so the frontend can redirect
    return result.insertedId.toString();
  }
}
