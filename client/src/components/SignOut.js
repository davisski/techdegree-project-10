import React, { useEffect } from 'react';
import {Redirect} from 'react-router-dom';

/**
 * @function {SignOut} - React stateless component. Signs out autheticated user.
 * @function {useEffect} - React hook.
 * 
 */
function SignOut({context}) {
    useEffect(() => context.actions.signOut())
    return (
        <Redirect to="/"/>
    )
}

export default SignOut;