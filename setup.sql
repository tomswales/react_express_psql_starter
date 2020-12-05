/* Need a postgres user with the right permissions to run this*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* Reset database on each restart - delete when you want to persist data */
DROP TABLE IF EXISTS users CASCADE;
DROP INDEX IF EXISTS user_index CASCADE;
DROP TABLE IF EXISTS user_roles;
DROP TYPE IF EXISTS status_type;

/* A generic status enum used across all tables*/
CREATE TYPE status_type AS ENUM ('ACTIVE', 'SUSPENDED', 'TERMINATED');

/* User accounts*/
CREATE TABLE IF NOT EXISTS users (
    _id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name          varchar(24),
    last_name           varchar(24),
    email_address	    varchar(48) NOT NULL,
    created		        TIMESTAMPTZ DEFAULT clock_timestamp(),
    password_hash	    TEXT NOT NULL,
    status	            status_type,
    first_login         BOOLEAN DEFAULT TRUE
);

/* Ensure users table is properly indexed */
CREATE INDEX IF NOT EXISTS user_index ON users (_id, first_name, last_name, email_address, status);

/* A mapping of users to admin roles - can extend to other roles */
CREATE TABLE IF NOT EXISTS user_roles (
    _id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID UNIQUE NOT NULL REFERENCES users(_id),
    super_admin		    BOOLEAN  NOT NULL
);

INSERT INTO users (first_name, last_name, email_address, password_hash, status) VALUES ('Anna', 'Davies', 'anna@example.com', crypt('abc1', gen_salt('bf', 10)), 'ACTIVE');
INSERT INTO users (first_name, last_name, email_address, password_hash, status) VALUES ('Dave', 'Elliston', 'dave@example.com', crypt('abc1', gen_salt('bf', 10)), 'ACTIVE');
INSERT INTO users (first_name, last_name, email_address, password_hash, status) VALUES ('Elise', 'Wilson', 'elise@example.com', crypt('abc1', gen_salt('bf', 10)), 'SUSPENDED');

INSERT INTO user_roles (user_id, super_admin) VALUES ((SELECT _id FROM users WHERE email_address = 'anna@example.com'), FALSE);
INSERT INTO user_roles (user_id, super_admin) VALUES ((SELECT _id FROM users WHERE email_address = 'dave@example.com'), TRUE);

