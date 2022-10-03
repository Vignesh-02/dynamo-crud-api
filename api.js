 const db = require('./db');
 const {
    GetItemCommand,
    PutItemCommand,
    DeleteItemCommand,
    ScanCommand,
    UpdateItemCommand
 } = require('@aws-sdk/client-dynamodb');
 const { marshall, unmarshall } =
 require('@aws-sdk/util-dynamodb');

const getPost = async(event) =>  {
    const response = { statusCode: 200}
    // This is the response of the lambda function

    // The body will be returned from the api endpoint

    try{
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            // we need marshall to convert JSON object to Dynamo DB record
            Key: marshall({ postId: event.pathParameters.postId }),

        };

        const { Item } = await db.send(new GetItemCommand(params));

        console.log({ Item });
        // Since we are using lambda proxy integration,
        // we need to stringify the response object.
        response.body = JSON.stringify({
           message: "successfully retrieved post",
           data: (Item) ? unmarshall(Item) : {},
            // unmarshall converts a dynamoDB record to an item
           rawData: Item
        });
    }catch (err){
        console.log(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get post",
            error: err.message,
            errorStack: err.stack
        });
    }
    return response;
}

const createPost = async(event) =>  {
    const response = { statusCode: 200}
    // This is the response of the lambda function

    // The body will be returned from the api endpoint

    try{
        //convert string to JSON object
        const body = JSON.parse(event.body);

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            // we need marshall to convert JSON object to Dynamo DB record
            Item: marshall( body || {} ),


        };

        const createResult = await db.send(new PutItemCommand(params));


        response.body = JSON.stringify({
           message: "successfully retrieved post",
           createResult
        });
    }catch (err){
        console.log(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create post",
            error: err.message,
            errorStack: err.stack
        });
    }
    return response;
}

const updatePost = async(event) =>  {
    const response = { statusCode: 200}
    // This is the response of the lambda function

    // The body will be returned from the api endpoint

    try{
        //convert string to JSON object
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            // we need marshall to convert JSON object to Dynamo DB record
            Key: marshall({ postId: event.pathParameters.postId }),
            // # allows us to escape reserved keywords in dynamoDB
            UpdateExpression: `SET ${objKeys.map((_,index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc,key,index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc,key,index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        };

        const updateResult = await db.send(new UpdateItemCommand(params));


        response.body = JSON.stringify({
           message: "successfully updated the post",
           updateResult
        });
    }catch (err){
        console.log(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update post",
            error: err.message,
            errorStack: err.stack
        });
    }
    return response;
}


const deletePost = async(event) =>  {
    const response = { statusCode: 200}
    // This is the response of the lambda function

    // The body will be returned from the api endpoint

    try{
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        };

        const deleteResult = await db.send(new DeleteItemCommand(params));


        response.body = JSON.stringify({
           message: "successfully updated the post",
           deleteResult
        });
    }catch (err){
        console.log(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete post",
            error: err.message,
            errorStack: err.stack
        });
    }
    return response;
}


const getAllPosts = async(event) =>  {
    const response = { statusCode: 200}
    // This is the response of the lambda function

    // The body will be returned from the api endpoint

    try{

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME
        };


        const { Items } = await db.send(new ScanCommand(params));


        response.body = JSON.stringify({
           message: "successfully retrieved all the posts",
           data: Items.map(item  => unmarshall(item)),
           Items
        });
    }catch (err){
        console.log(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to delete post",
            error: err.message,
            errorStack: err.stack
        });
    }
    return response;
}

module.exports ={
    getPost,
    createPost,
    updatePost,
    deletePost,
    getAllPosts
}