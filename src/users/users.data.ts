import {db} from '../db/db';
import {Users, UserDisplayDataResult} from './users.interface';
import {User, UserRegistrationRequest, UserDisplayData, UserPermissions} from './user.interface';

export const getUsers = async (firstName?: string, lastName?: string, email?: string): Promise<UserDisplayDataResult> => {

	const users = await db.select(
		"_id",
		"first_name as firstName",
		"last_name as lastName",
		"email_address as emailAddress",
		"created",
		"status"
	).from("users")
	.modify((queryBuilder, firstNameCondition) => {
		if(firstNameCondition) {
			queryBuilder.whereRaw('LOWER(first_name) like ?', [`%${firstNameCondition}%`])
		}
	}, firstName)
	.modify((queryBuilder, lastNameCondition) => {
		if(lastNameCondition) {
			queryBuilder.whereRaw('LOWER(last_name) like ?', [`%${lastNameCondition}%`])
		}
	}, lastName)
	.modify((queryBuilder, emailCondition) => {
		if(emailCondition) {
			queryBuilder.whereRaw('LOWER(email_address) like ?', [`%${emailCondition}%`])
		}
	}, email)
	.catch(error => throwDatabaseError("Unable to fetch users"));
	return users as UserDisplayDataResult;
}

export const getById = async (userId: string): Promise<UserDisplayData> => {
	const users = await db.select(
		"_id",
		"first_name as firstName",
		"last_name as lastName",
		"email_address as emailAddress",
		"created",
		"status"
	).from("users").where("_id", userId)
	.catch(error => throwDatabaseError("Unable to fetch user"));
	if(users && users.length > 0) {
		return users[0] as UserDisplayData;
	}
	else {
		throwDatabaseError('No user found');
	}
}

export const getUserAndPermissionsByEmailAndPassword = async(email: string, password: string): Promise<UserPermissions> => {
	const userPermissions = await db.select(
			"users._id as _id",
			"user_roles.super_admin as superAdmin"
		)
		.from("users")
		.innerJoin("user_roles", "users._id", "=", "user_roles.user_id")
		.whereRaw('password_hash = crypt(?, password_hash)', [password])
		.andWhere("users.status", 'ACTIVE')
		.andWhere("users.email_address", email);
	if(userPermissions && userPermissions.length > 0) {
		return userPermissions[0] as UserPermissions;
	}
	else {
		throwDatabaseError('Invalid credentials');
	}
}

export const insertOne = async (user: UserRegistrationRequest): Promise<number> => {
	await db.raw("INSERT INTO users (first_name, last_name, email_address, password_hash, status) VALUES (?, ?, ?, crypt(?, gen_salt('bf', 10)), ?);",
			[user.firstName, user.lastName, user.email, user.password, user.status])
	.catch(error => throwDatabaseError("Unable to register new user"));

	return 1;
}

export const deleteOne = async (superAdminId: string, userId: string): Promise<number> => {
	// Superadmin should not be able to delete their own account
	const res = await db("users").where("_id", userId).andWhereNot("_id", superAdminId).del()
	.catch(error => throwDatabaseError("Unable to delete user"));

	return res as number;
}

export const countAll = async (): Promise<any> => {
	const countRows = await db.raw("SELECT count(*) as user_total FROM users")
	.catch(error => throwDatabaseError("Unable to fetch user count"));
	return countRows.rows
}

export const countByStatus = async (): Promise<any> => {
	const countRows = await db.raw("SELECT status, count(status) as status_count FROM users GROUP BY status;")
	.catch(error => throwDatabaseError("Unable to fetch user count"));
	return countRows.rows
}

function throwDatabaseError(message: string) {
	throw new Error(`${message}`)
}