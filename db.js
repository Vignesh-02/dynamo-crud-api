const { DynamoDBClient } = require("@aaws-sdk/client-dynamodb");
const client = new DynamoDBClient({});

module.exports = client;

