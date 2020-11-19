import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { requireAuth } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  
  app.get( "/filteredimage/", 
    requireAuth, 
    async ( req, res ) => {
    let {image_url} = req.query;
    if(!image_url){
      return res.status(400).send("Image url is required!");
    }
    try{
      const filtered_path = await filterImageFromURL(image_url);
      res.sendFile(filtered_path);
      res.on('finish', () => deleteLocalFiles([filtered_path]));
    } catch {
      return res.sendStatus(500);
    }
    });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();