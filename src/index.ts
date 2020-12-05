import express, { Request, Response, NextFunction} from 'express';
import fetch from 'node-fetch';
import * as path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import {usersRouter} from './users/users.router';
import * as db from './db/db';

// Check .env file for environment variables
dotenv.config();

// Check if PORT environment variable was set
if (!process.env.PORT) {
   process.exit(1);
}

// initialise the database with initial data
db.initialise();

// Declare express application
const app = express();

// Ensure CORS policy allows access
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// Parse incoming request bodies available under the req.body property
app.use(express.json());

// Register the example users API route
app.use("/api/v1/users", usersRouter);

app.use("/admin", express.static(path.resolve(__dirname, '../admin/build')));

// Get app status
app.get("/", (req: Request, res: Response) => {
	res.status(200).send({status: 'OK', version: '1.0.0'})
})

// Get admin UI
app.get("/admin", (req: Request, res: Response) => {
	// res.status(200).send({status: 'Proxy server is running'})
	res.sendFile(path.resolve(__dirname, '../admin/build/index.html'));
})

// tslint:disable-next-line
app.listen((process.env.PORT), ()=> console.log(`Running on port ${process.env.PORT}`));


