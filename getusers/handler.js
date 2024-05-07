import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let dynamoDBClientParams = { region: 'us-east-1' }

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
  }
}

const client = new DynamoDBClient(dynamoDBClientParams);
const docClient = DynamoDBDocumentClient.from(client);


const getby = async (event, context) => {

  let userId = event.pathParameters.id;
  const command = new QueryCommand({
    TableName: "usersTable",
    KeyConditionExpression:
      "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": userId
    },
    ConsistentRead: true,
  });

  const response = await docClient.send(command);
  return {
      "statusCode": 200,
      "body": JSON.stringify({ 'user': response})
  }

};

module.exports = {
  getby
}
