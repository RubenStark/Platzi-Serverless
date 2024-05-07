import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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


const updateUsers = async (event, context) => {

  let userId = event.pathParameters.iduser
  const body = JSON.parse(event.body)

  console.log(body)
  console.log(userId)

  const command = new UpdateCommand({
    TableName: "usersTable",
    Key: {
      pk: userId,
    },
    UpdateExpression: "set #name = :name",
    ExpressionAttributeNames: { '#name' : 'name' },
    ExpressionAttributeValues: {
      ":name": body.name,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);
  return {
    "statusCode": 200,
    "body":  JSON.stringify({ 'user': response.Attributes })
  }

};

module.exports = {
  updateUsers
}
