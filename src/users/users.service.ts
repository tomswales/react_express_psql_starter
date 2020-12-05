import { User, UserRegistrationRequest, UserDisplayData } from "./user.interface";
import { Users, UserDisplayDataResult} from "./users.interface";
import * as UsersData from './users.data';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as path from 'path';
import Chance from 'chance';

// Ensure JWT token is accessible in environment
dotenv.config({path: path.resolve('.env')});

export const findUsers = async (queryParams: any): Promise<UserDisplayDataResult> => {

	// Transform query parameters to lowercase if they exist
	const firstName: string = queryParams.firstName ? queryParams.firstName as string : undefined;
    const lastName: string = queryParams.lastName ? queryParams.lastName as string : undefined;
    const email: string = queryParams.email ? queryParams.email as string : undefined;
	return await UsersData.getUsers(firstName?.toLowerCase(), lastName?.toLowerCase(), email?.toLowerCase());
}

export const findById = async (userId: string): Promise<UserDisplayData> => {
	return await UsersData.getById(userId);
}

// Insert a new user, first hashing their password
export const insertOne = async (newUser: UserRegistrationRequest): Promise<number> => {
	return await UsersData.insertOne(newUser);
}

export const deleteOne = async (superAdminId: string, userId: string): Promise<number> => {
	return await UsersData.deleteOne(superAdminId, userId);
}

export const countUsers = async(): Promise<any[]> => {
	return await UsersData.countAll();
}

export const countUsersByStatus = async(): Promise<any[]> => {
	return await UsersData.countByStatus();
}

export const requestToken = async (email: string, password: string): Promise<string> => {
	const user = await UsersData.getUserAndPermissionsByEmailAndPassword(email, password)
	const chance = new Chance();
	if (user) {
		const token = jwt.sign({
			// ten minute expiry
			exp: Math.floor(Date.now() / 1000) + (60 * 10),
			jwtid: chance.guid(),
			_id: user._id,
			superAdmin: user.superAdmin
		}, process.env.JWTSECRET);
		return token;
	}
	else {
		throw new Error("User not found");
	}
}