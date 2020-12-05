import express, { Request, Response, NextFunction } from "express";
import * as UsersService from "./users.service";
import dotenv from 'dotenv';
import * as path from 'path';
import { User, UserRegistrationRequest, UserDisplayData } from "./user.interface";
import { Users, UserDisplayDataResult } from "./users.interface";
import { body, checkSchema, validationResult, ValidationError, Result } from 'express-validator';
import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';

export const usersRouter = express.Router();

/*
  Authentication strategies
*/

// Ensure JWT token is accessible in environment
dotenv.config({path: path.resolve('.env')});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTSECRET
}

// Checks for super user permissions
passport.use('superUser', new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user: UserDisplayData = await UsersService.findById(jwtPayload._id);
      if(user && jwtPayload.superAdmin) {
        return done(null, user, "Authentication successful");
      }
      else {
        return done(new Error("Authentication failed"), false, "Authentication failed");
      }
    } catch (e) {
        return done(e, false, "Authentication failed");
    }
}));

// Checks for ordinary user permissions
passport.use('regularUser', new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user: UserDisplayData = await UsersService.findById(jwtPayload._id);
      return done(null, user, "Authentication successful");
    } catch (e) {
        return done(e, false, "Authentication failed");
    }
}));


/**
 * Users controller
 */

// get a list of users (with ability to filter, sort and paginate)

usersRouter.get("/", passport.authenticate('superUser', { session: false }), checkSchema({
  firstName: {
    in: ['query'],
    optional: true
  },
  lastName: {
    in: ['query'],
    optional: true
  },
  email: {
    in: ['query'],
    optional: true
  }
}), async (req: Request, res: Response) => {
  try {
    const errors: ValidationError[] = validationResult(req).array();
    if(errors.length > 0) {
      return res.status(422).json({errors});
    }
    else {
      const users: UserDisplayDataResult = await UsersService.findUsers(req.query);
      res.status(200).send(users);
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

// get a user by id

usersRouter.get("/:_id", passport.authenticate('superUser', { session: false }), checkSchema({
  _id: {
    isUUID: true,
    in: ['params'],
    errorMessage: '_id must be a UUID'
  }
}), async (req: Request, res: Response) => {
  try {
    const errors: ValidationError[] = validationResult(req).array();
    if(errors.length > 0) {
      return res.status(422).json({errors});
    }
    else {
      const user: UserDisplayData = await UsersService.findById(req.params._id);
      res.status(200).send(user);
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

// count the total number of users

usersRouter.get("/summary/count", passport.authenticate('superUser', { session: false }), async (req: Request, res: Response) => {
  try {

    const total: any = await UsersService.countUsers();

    res.status(200).send(total);
  } catch (e) {
    res.status(403).send(e.message);
  }
});

usersRouter.get("/summary/status", passport.authenticate('superUser', { session: false }), async (req: Request, res: Response) => {
  try {

    const total: any = await UsersService.countUsersByStatus();

    res.status(200).send(total);
  } catch (e) {
    res.status(403).send(e.message);
  }
});

// register a new user

usersRouter.post("/user", passport.authenticate('superUser', { session: false }), async (req: Request, res: Response) => {
  try {
    const user: UserRegistrationRequest = req.body.user;

    await UsersService.insertOne(user);

    res.sendStatus(201);
  } catch (e) {
    res.status(403).send(e.message);
  }
});

// delete a user record

usersRouter.delete("/:_id", passport.authenticate('superUser', { session: false }), async (req: Request, res: Response) => {
  try {

    const admin = req.user as UserDisplayData;
    const deleted = await UsersService.deleteOne(admin._id, req.params._id);
    if(deleted) {
      res.sendStatus(200);
    }
    else {
      res.status(404).send("Unable to delete user");
    }
  } catch (e) {
    res.status(403).send(e.message);
  }
});

// Login with token

usersRouter.post("/authenticate/login", passport.authenticate('regularUser', { session: false }), async (req: Request, res: Response) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(401).send("Invalid or expired token");
  }
});

// Get token
usersRouter.post("/authenticate/token", async (req: Request, res: Response)=> {
    try {
      const token = await UsersService.requestToken(req.body.email, req.body.password);
      res.status(200).send({token});
    } catch (e) {
      res.status(401).send(e.message);
    }
});