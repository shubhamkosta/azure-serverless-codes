const { CosmosClient } = require("@azure/cosmos");

var endpoint = process.env["CosmosDBEndpoint"];
var key = process.env["CosmosDBAuthKey"];
var databaseName = process.env["DatabaseName"];
var collectionName = process.env["CollectionName"];

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req, inputDocument) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const itemBody = {
        "email": req.query.email,
        "location": req.body.location,
        "interests": req.body.interests
    }
    
    if(inputDocument.length != 0)
    {   
        itemBody.id = inputDocument[0].id;
    }

    await client.database(databaseName).container(collectionName).items.upsert(itemBody)
    .then((status) => { 
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Item Saved successfully"
        };
    })
    .catch((err) => { 
        context.res = {
            status: 500,
            body: err
        };
    });        
};