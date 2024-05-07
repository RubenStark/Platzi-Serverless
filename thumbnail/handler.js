import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
const sharp = require('sharp');
const { Readable } = require('stream');

let clientParams = { region: 'us-east-1' }
const client = new S3Client(clientParams);

const thumbnailGenerator = async (event, context) => {

    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    try {

        let origimage = await client
            .send(new GetObjectCommand({
                Key: srcKey,
                Bucket: srcBucket,
            }))
        let content_buffer = null;
        let imgBody=origimage.Body;

        if (imgBody instanceof Readable) {
            content_buffer = Buffer.concat(await imgBody.toArray());
        } else {
            throw new Error('Unknown object stream type');
        }
        const widths = [50, 100, 200];
        for (const w of widths) {
            await resizer(content_buffer, w, srcBucket, srcKey);
        }

    } catch (error) {
        console.log(error);
        return;
    }


};

const resizer = async (_content_buffer, newSize, dstBucket, fileKey) => {

    const nameFile = fileKey.split('/')[1];
    const dstKey = `resized/${newSize}-${nameFile}`;

    try {
        let buffer = await sharp(_content_buffer).resize(newSize).toBuffer();
        const destparams = {
            Bucket: dstBucket,
            Key: dstKey,
            Body: buffer,
            ContentType: "image"
        };
        const command = new PutObjectCommand(destparams);
        await client.send(command);

        console.log('Successfully resized ' + dstBucket + '/' + fileKey +
            ' and uploaded to ' + dstBucket + '/' + dstKey);

    } catch (error) {
        console.log(error);
        return;
    }
}

module.exports = {
    thumbnailGenerator
}