import knex from "knex";
import nextConnect from "next-connect";

let client;

async function database(req, res, next) {
  try {
    if (!client) {
      client = knex({
        client: 'pg',
        connection: {
          host : process.env.DB_HOST,
          user : process.env.DB_USER,
          password : process.env.DB_PASSWORD,
          database : process.env.DB_NAME
        }
      });
      
      // Create a table
      await client.schema.hasTable('accounts').then((exists) => {
        if (!exists) {
          return client.schema.createTable('accounts', table => {
              table.increments('id');
              table.text('authEmail');
              table.text('authToken');
              table.text('channelToken');
              table.text('userId');
              table.timestamps();
            });
        }
      })

      console.log('DB Connected')

      // Store the connection
      // Buggy
      // req.knex = client;
      // for the DELETE
      global.knex = client;
    } 

    return next();
  } catch (e) {
    console.log(e)
  }
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
