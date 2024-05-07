import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

let clientParams = { region: 'us-east-1' }
const client = new S3Client(clientParams);

const signedS3URL = async (event, context) => {
    const filename = event.queryStringParameters.filename
    let getObjectParams = {
        Bucket: process.env.BUCKET, // required
        Key: `upload/${filename}` // required
    };
    const command = new PutObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    return {
        "statusCode": 200,
        "body": JSON.stringify({ signedUrl })
    }
}

module.exports = {
    signedS3URL
}