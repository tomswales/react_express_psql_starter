import React, {useState} from 'react';
import {fetchCall} from '../../utils/utils';
import {AuthStateUpdate} from '../../interfaces';

interface LoginProps {
	authDispatch: (value: AuthStateUpdate) => void;
}

function Login({authDispatch}: LoginProps) {
    const [enteringEmail, setEnteringEmail] = useState("");
    const [enteringPassword, setEnteringPassword] = useState("");
    
    return (
      
    <div className="centered full-height full-width primary-background vertical-layout">
        <form className="panel login-panel" onSubmit={onSubmit} >
            <p className="panel-heading">
                Log in
            </p>
            <div className="panel-block">
                <p className="control has-icons-left">
                <input className="input" type="text" placeholder="Email address" onChange={handleEmailChange}/>
                <span className="icon is-left">
                    <i className="fas fa-user" aria-hidden="true"></i>
                </span>
                </p>
            </div>
            <div className="panel-block">
                <p className="control has-icons-left">
                <input className="input" type="password" placeholder="Password" onChange={handlePasswordChange}/>
                <span className="icon is-left">
                    <i className="fas fa-key" aria-hidden="true"></i>
                </span>
                </p>
            </div>
            <div className="panel-block">
                <button disabled={isButtonDisabled()} type="submit" className="button">Log in</button>
            </div>
        </form>
    </div>
  );

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        fetchCall("http://localhost:8080/api/v1/users/authenticate/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: enteringEmail,
                password: enteringPassword
            })
            }, (json: any)=>{
                setEnteringEmail("");
                setEnteringPassword("");
                authDispatch({type: "update", payload: {token: json.token}});
            }, (e: Error)=>{
                setEnteringEmail("");
                setEnteringPassword("");
                console.log(e);
        });
    }

    function isButtonDisabled() {
        return !(enteringEmail.length > 0 && enteringPassword.length > 0)
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEnteringEmail(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEnteringPassword(event.target.value);
    }
}

export default Login;
