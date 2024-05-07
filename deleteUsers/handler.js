import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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


const deleteUsers = async (event, context) => {

  let userId = event.pathParameters.id;

  const command = new DeleteCommand({
    TableName: "usersTable",
    Key: {
      pk: userId,
    },
  });
  const result = await docClient.send(command);

  const response = {
    'statusCode': result.$metadata.httpStatusCode,
    'body': JSON.stringify({ 'message':'user '+userId+' deleted'})
  }
  return response;

};

module.exports = {
  deleteUsers
}
