import * as fs from 'fs';
import * as path from 'path';
import knex from 'knex';
import pg from 'pg';
import {Decimal} from 'decimal.js';

// Set up some type parsing for the DB
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
   return parseInt(value, 10);
});

pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (value: string) => {
   return new Date(value);
});

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
    return parseFloat(value);
});

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return new Decimal(value);
});

// Set up knex connection - this will be exported to all users
export const db = knex({
  client: 'pg',
  connection: {
    host : process.env.PGHOST,
    user : process.env.PGUSER,
    password : process.env.PGPASSWORD,
    database : process.env.PGDATABASE,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432
  }
});

// Function to insert some test data into the database on startup
export const initialise = async () => {

	try {
		const sql = fs.readFileSync(path.resolve("./setup.sql")).toString();
		await db.raw(sql);

	} catch (e) {
		throw new Error(e.message);
	}
}


