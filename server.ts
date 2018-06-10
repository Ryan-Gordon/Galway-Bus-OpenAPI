//Import librarys used 
import * as express from 'express';
import * as exegesisExpress from 'exegesis-express';
import * as path from 'path';
import * as fs from 'fs';
//You may choose HTTP or HTTPS, if HTTPS you need a SSL Cert
import * as http from 'http';

import * as swaggerUI from './swagger-ui';
import {Request, Response} from "express";

const PORT = 3000;

export interface SwaggerUIConfig {
    title?: string;
    url: string;
  }
    

async function createServer() {
    // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
    const options = {
        controllers: path.resolve(__dirname, './controllers'),
        controllersPattern: "**/*.@(ts|js)"
    };

    // This creates an exgesis middleware, which can be used with express,
    // connect, or even just by itself.
    const exegesisMiddleware = await exegesisExpress.middleware(
        path.resolve(__dirname, './api_docs/openapi.yaml'),
        options
    );

    const app = express();

    // If you have any body parsers, this should go before them.
    app.use(exegesisMiddleware);

    //This appears to be needed to generate the docs correctly. 
    /**
     * UI Doc route
     * This route is responsible for reading the contents of the openapi.yaml file and then sending it as a JSON object.
     * 
     * This JSON object is then used to generate the swagger docs
     */
    app.route('/uidoc')
    .get((req: Request, res: Response) => {
         
        res.setHeader('content-type', 'application/json');
            res.send(fs.readFileSync(path.resolve(__dirname, './api_docs/openapi.yaml'),));
        }) 
        
    /**
     * Route responsible for the generation of UI docs
     * 
     * Gets the OpenAPI spec from /uidoc route as a JSON object
     * Takes this JSON object and generates docs using the swagger-ui.ts file.
     */
    app.route('/ui')
    .get((req: Request, res: Response) => {
            //Send the Swagger-UI docs with our OpenAPI spec applied.      
            res.send(swaggerUI.swaggerUI("/uidoc"));
        })  
    
    // Return a 404
    app.use((req, res) => {
        res.status(404).json({message: `Not found`});
    });

    // Handle any unexpected errors
    app.use((err, req, res, next) => {
        res.status(500).json({message: `Internal error: ${err.message}`});
    });
    //Used to create a HTTP Server
    const server = http.createServer(app);

    /**
     * If you want to run a HTTPS server instead you must:
     * + Get a SSL Cert and Key to use 
     * + Change the server type from http to https as shown below
     *
     
    const httpsOptions = {
        key: fs.readFileSync('./config/key.pem'),
        cert: fs.readFileSync('./config/cert.pem')
    }
    const server = https.createServer(httpsOptions,app);

    */
    return server;
}
//Run our createServer function
createServer()
.then(server => {
    server.listen(PORT);
    console.log("Listening on port 3000");
    console.log("Try visiting http://localhost:3000/greet?name=Jason");
})
.catch(err => {
    console.error(err.stack);
    process.exit(1);
});
