import {Dispatch} from 'react';
import {UserDisplayData, UserPermissions, AuthState, AuthStateUpdate} from '../interfaces';
import {useEffect, useReducer} from 'react';
import {fetchCall} from '../utils/utils';
import jwtDecode, { JwtPayload } from "jwt-decode";


export const useAuthState = (): [AuthState, Dispatch<AuthStateUpdate>] =>{
	const initialAuthState: AuthState = {
		loggingIn: true,
		token: null,
		tokenPermissions: null,
		profile: null
	}

	const [authState, authDispatch] = useReducer(authStateReducer, initialAuthState);

	useEffect(()=> {

		const token = authState.token;

		if (authState.token && !authState.profile) {
			fetchCall("http://localhost:8080/api/v1/users/authenticate/login", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			}, (json: any)=>{
				const decodedToken = jwtDecode<JwtPayload>(authState.token as string) as UserPermissions;
				authDispatch({
					type: "update", 
					payload: {
						loggingIn: false, 
						profile: (json as UserDisplayData), 
						tokenPermissions: decodedToken
					}
				});
			}, (e: Error)=>{
				authDispatch({
					type: "reset", 
					payload: {
						
					}
				});
			});
		}
	}, [authState])

	return [authState, authDispatch];
}


export const authStateReducer = (state: AuthState, action: AuthStateUpdate) => {
  switch (action.type) {
    case 'update':
      return {...state, ...action.payload};
    case 'reset':
      return {
		loggingIn: true,
		token: null,
		tokenPermissions: null,
		profile: null
	};

    default:
      throw new Error();
  }
}