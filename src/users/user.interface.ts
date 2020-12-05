
// Example of an interface for a single data item
export interface User {
	_id: string,
	firstName?: string,
	lastName?: string,
	email?: string,
	created: Date
}

export interface UserRegistrationRequest {
	name: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password: string;
	status: string;
}

export interface UserDisplayData {
	_id: string,
	firstName?: string,
	lastName?: string,
	email?: string,
	created: Date,
	status: string
}

export interface UserPermissions {
	_id: string;
	superAdmin: boolean;
}