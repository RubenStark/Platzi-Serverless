import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

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


const create = async (event, context) => {
  try {
    const user = JSON.parse(event.body);
    
    const newBook = {
        ...user,
        pk: randomUUID(),
    };
    await docClient.send(new PutCommand({
        TableName: "usersTable",
        Item: newBook,
    }));

    return {
      "statusCode": 200,
      "body": JSON.stringify({ 'user': newBook})
  }
}
catch (error) {
    console.error(error);
    return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
    };
}

};

module.exports = {
  create
}
