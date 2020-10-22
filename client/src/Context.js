import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

// create context
const Context = React.createContext();

/**
 * @extends {Provider} - React stateful component
 */
export class Provider extends Component{
    constructor(){
        super();
        this.data = new Data();
    }
    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    }

    render(){
        const {authenticatedUser} = this.state;
        //value object, pass down to properties and actions to child components
        const value = {
            authenticatedUser,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut
            }
        }
        return(
            <Context.Provider value={value}>
                {/* every child component can have access to properties and actions by this.props */}
                {this.props.children}
            </Context.Provider>
        )
    }
    /**
     * 
     * @param {username} - String 
     * @param {password} - String 
     */
    signIn = async (username, password) => {
        try {
            // try get user
            const user = await this.data.getUser(username, password);
            // set user password
            user.password = password;

            this.setState(() => {
                return {
                    authenticatedUser: user
                }
            })
            // store cookie for authenticated user 
            Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1});
            return user;

        } catch (error) {
            throw error.response;
        }
        
    }
    /**
     * @method {signOut} - Sign out user.
     */
    signOut = () => {
        this.setState(() => {
            return {
                authenticatedUser: null
            }
        })
        Cookies.remove('authenticatedUser');
    }
}

export const Consumer = Context.Consumer;

export default function withContext(Component){
    return function ContextComponent(props){
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        )
    }
}