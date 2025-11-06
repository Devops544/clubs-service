import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3UploadService {
  AWS_S3_BUCKET = process.env.AWS_BUCKET_NAME;
  s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1',
  });

  async uploadFile(file) {
    const fileBuffer = await this.streamToBuffer(file.createReadStream());
    const uniqueFilename = `${uuidv4()}-${file.filename}`;
    const data = await this.s3_upload(
      fileBuffer,
      this.AWS_S3_BUCKET,
      uniqueFilename,
      file.mimetype,
    );
    return data;
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-west-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log('Error from S3 response: ', e);
      throw new Error(`Failed to upload file to S3: ${e.message}`);
    }
  }

  async streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      stream.on('error', (error: Error) => {
        reject(error);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: fileKey,
      };
      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      console.log('Error deleting file from S3: ', error);
      return false;
    }
  }

  async getSignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    try {
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: fileKey,
        Expires: expiresIn,
      };
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.log('Error generating signed URL: ', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }
}
