import React, {ReactElement} from 'react';
import Login from './Login/Login';
import Secure from './Secure/Secure';
import {useAuthState} from '../reducers/authReducer';
import './app.scss';

const App = (): ReactElement => {

	const [authState, authDispatch] = useAuthState();

	if (authState.loggingIn) {
		return <Login authDispatch={authDispatch}/>
	}
	else {
		return <Secure authState={authState} authDispatch={authDispatch}/>
	}
}

export default App;