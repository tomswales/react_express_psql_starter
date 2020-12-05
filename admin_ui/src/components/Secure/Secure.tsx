import React, {useState} from 'react';
import {AuthState, AuthStateUpdate} from '../../interfaces';
// use router to decide which content to display
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

interface SecureProps {
    authState: AuthState;
	authDispatch: (value: AuthStateUpdate) => void;
}

function Secure({authDispatch, authState}: SecureProps) {
    console.log(authState.profile)
    return (
      
        <div className="full-width full-height vertical-layout">
            <header className="level header">
                <div className="level-left">

                </div>
                <div className="level-middle">
                </div>
                <div className="level-right">
                    <div className="level-item">
                        <button className="button" onClick={handleLogoutClick}>Logout</button>
                    </div>
                </div>
            </header>
            <div className="secure">
                <h1 className="title">{"Welcome " + (authState.profile?.firstName ? authState.profile?.firstName : "stranger") + "!"}</h1>
                <h2 className="subtitle">It's good to see you again</h2>
                <p>{authState.tokenPermissions?.superAdmin ? "You have super-admin permissions" : "You have ordinary user permissions"}</p>
            </div>
        </div>
    );

    function handleLogoutClick(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		authDispatch({type: "reset", payload: {} });
	}

}

export default Secure;
