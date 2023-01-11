import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import * as fs from 'fs';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]


  app.get('/filteredimage', (req:Request, res:Response) => {
    // Validate the image_url query parameter
    const imageUrl:string = req.query.image_url.toString();
    if (!imageUrl) {
      return res.status(400).send({ error: 'Missing image_url query parameter' });
    }
  
    // Call filterImageFromURL to filter the image
    filterImageFromURL(imageUrl)
      .then((filteredPath:string) => {
        // Send the resulting file in the response
        res.sendFile(filteredPath, () => {
          // Delete the file from the server on finish of the response
          fs.unlinkSync(filteredPath);
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ error: 'Failed to filter image' });
      });
  });
  
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res:Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();