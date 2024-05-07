import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

let dynamoDBClientParams = { region: 'us-east-1' }
const client = new DynamoDBClient(dynamoDBClientParams);
const docClient = DynamoDBDocumentClient.from(client);


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
const likeuser = async (event, context) => {
    const body = event.Records[0].body
    const userid = JSON.parse(body).id
    console.log(userid)
    const params = {
        TableName: 'usersTable',
        Key: { pk: userid },
        UpdateExpression: "ADD likes :inc",
        ExpressionAttributeValues: {
            ':inc': 1
        },
        ReturnValues: 'ALL_NEW'
    }

    const result = await docClient.send(new UpdateCommand(params));

    //await sleep(4000) //solo prueba
    console.log(result)
}
module.exports = { likeuser }