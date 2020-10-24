import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import ErrorContainer from "../error/ErrorContainer";


/**
 * @extends {CourseDetail} - Extends react stateful component.
 * @method {componentDidMount} - React built in lifecycle method, invoked immediately after component is mounted.
 * @method {change} - Listens to input target name and value. Sets state base on input name and value.
 * @method {validateEmail} - Validate user input email.
 * @method {submit} - Handle form submission, store newly created course to database.
 */
class SignIn extends Component{
    state = {
        emailAddress: '',
        password: '',
        errors: [],
        errorType: 'Validation'
    }
    componentDidMount(){
        console.log(this.props)
        const {context, history} = this.props;

        if(context.authenticatedUser){
            history.push('/');
        }
    }
    render(){
        const {emailAddress, password, errors, errorType} = this.state;
        return (
          <div className="bounds">
            <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                <div>
                {errors.length ? <ErrorContainer errorType={errorType} errors={errors} /> : '' }
                    <form onSubmit={this.submit}>
                        <div>
                            <input onChange={this.change} id="emailAddress" name="emailAddress" type="text" placeholder="Email Address" className="" value={emailAddress} />
                        </div>
                        <div>
                            <input onChange={this.change} id="password" name="password" type="password" placeholder="Password" className="" value={password} />
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Sign In</button>
                            <NavLink className="button button-secondary" to={`/`}>Cancel</NavLink>
                        </div>
                    </form>
                </div>
                <p>&nbsp;</p>
                <p>Don't have a user account? <NavLink to={`/signup`}>Click here</NavLink> to sign up!</p>
            </div>
          </div>
        )
    }
    /**
     * 
     * @param {e} - Mouse event object 
     */
    change = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState(() => {
            return {
                [name]: value
            }
        })
    }
    /**
     * 
     * @param {email} - String 
     */
    validateEmail = (email) => {
        // regular expression
        const regex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        return regex.test(email);
    }
    /**
     * 
     * @param {e} - Mouse event object 
     */
    submit = (e) => {
        e.preventDefault();
        
        const {context, history, location} = this.props;

        // pull out properties
        const {
            emailAddress,
            password
        } = this.state;

        // store boolean to isValid 
        const isValid = this.validateEmail(emailAddress);

        // checks if is valid email and password field is not empty
        if(isValid && password !== ''){
            // handle promise
            context.actions.signIn(emailAddress, password).then(user => {
                if(user){
                    if(location.state.from !== undefined){
                        history.push(location.state.from.pathname);
                    }else{
                        history.goBack(-1);
                    }
                }
            // handle error
            }).catch(error => {
                if(error.status === 401){
                    this.setState(() => {
                        return {
                            errors: [error.data.error.message],
                            errorType: 'Authorization'
                        }
                    })
                }else if(error.status === 500){
                    this.props.history.push('/error');
                }
            });
        }else if(!isValid){
            this.setState(() => {
                return {
                    errors: ['Please check your credentials!']
                }
            })
        }        
    }
}

export default SignIn;