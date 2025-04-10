import { ImageDao } from "../ImageDao";
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

export class S3ImageDao implements ImageDao {
  private BUCKET = "tweeterimagebucketaustinbeckstead";
  private REGION = "us-west-2";
  private client = new S3Client({ region: this.REGION });

  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: this.BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    try {
      await this.client.send(c);
      return `https://${this.BUCKET}.s3.${this.REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
