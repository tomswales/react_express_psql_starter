// These interfaces are duplicated with those in server .src files - need to refactor
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

export interface AuthState {
	loggingIn: boolean;
	token: string | null;
	tokenPermissions: UserPermissions | null;
	profile: UserDisplayData | null;
}

export interface AuthStateUpdate {
	type: string,
	payload: Partial<AuthState>
}