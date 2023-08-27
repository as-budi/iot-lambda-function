import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "iot-data";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

try {
    switch (true) {
    // case "DELETE /items/{sample_time}":
    //     await dynamo.send(
    //     new DeleteCommand({
    //         TableName: tableName,
    //         Key: {
    //         sample_time: event.pathParameters.sample_time,
    //         },
    //     })
    //     );
    //     body = `Deleted item ${event.pathParameters.sample_time}`;
    //     break;
    // case "GET /items/{sample_time}":
    //     body = await dynamo.send(
    //     new GetCommand({
    //         TableName: tableName,
    //         Key: {
    //         sample_time: event.pathParameters.sample_time,
    //         },
    //     })
    //     );
    //     body = body.Item;
    //     break;
    case event.httpMethod ==='GET' && event.path === '/items':
        body = await dynamo.send(
        new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
    // case "PUT /items":
    //     let requestJSON = JSON.parse(event.body);
    //     await dynamo.send(
    //     new PutCommand({
    //         TableName: tableName,
    //         Item: {
    //         id: requestJSON.sample_time,
    //         price: requestJSON.device_id,
    //         name: requestJSON.raspiTemp,
    //         },
    //     })
    //     );
    //     body = `Put item ${requestJSON.sample_time}`;
    //     break;
    default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
} catch (err) {
    statusCode = 400;
    body = err.message;
} finally {
    body = JSON.stringify(body);
}
  

  return {
    statusCode,
    body,
    headers,
  };
};
