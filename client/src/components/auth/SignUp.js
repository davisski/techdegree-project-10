import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import ErrorContainer from "../error/ErrorContainer";
import Cookies from 'js-cookie';

/**
 * @extends {CourseDetail} - Extends react stateful component.
 * @method {componentDidMount} - React built in lifecycle method, invoked immediately after component is mounted.
 * @method {change} - Listens to input target name and value. Sets state base on input name and value.
 * @method {resetForm} - Clear form fields.
 * @method {submit} - Handle form submission, store newly created course to database.
 */
class SignUp extends Component{
    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        errors: []
    }
    componentDidMount() {
        const {context, history} = this.props;

        // if user already authenticated then redirect
        if(context.authenticatedUser){
            history.push("/");
        }
    }
    render(){
        // pull out properties from state object
        const {firstName, lastName, emailAddress, password, confirmPassword, errors} = this.state;
        return (
           <div className="bounds">
               <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>
                        {errors.length ? <ErrorContainer errorType="Validation" errors={errors} /> : '' }
                        <form onSubmit={this.submit}>
                            <div>
                                <input onChange={this.change} value={firstName} id="firstName" name="firstName" type="text" className="" placeholder="First Name" />
                            </div>
                            <div>
                                <input onChange={this.change} value={lastName} id="lastName" name="lastName" type="text" className="" placeholder="Last Name" />
                            </div>
                            <div>
                                <input onChange={this.change} value={emailAddress} id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address"/>
                            </div>
                            <div>
                                <input onChange={this.change} value={password} id="password" name="password" type="password" className="" placeholder="Password" />
                            </div>
                            <div>
                                <input onChange={this.change} value={confirmPassword} id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" />
                            </div>
                            <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><NavLink className="button button-secondary" to={`/`}>Cancel</NavLink></div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <NavLink to={`/signin`}>Click here</NavLink> to sign in!</p>
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
            return{
                [name]: value
            }
        })
    }
    // resets form input fields
    resetForm = () => {
        this.setState(() => {
            return {
                firstName: '',
                lastName: '',
                emailAddress: '',
                password: '',
                confirmPassword: '',
                errors: []
            }
        })
    }
    /**
     * 
     * @param {e} - Mouse event object 
     */
    submit = (e) => {
        e.preventDefault();
       
       const {context, history, location} = this.props;

       // pull out properties from state object
       const {firstName, lastName, emailAddress, password, confirmPassword} = this.state;
        
       // Create new user object with following properties
       const user = {
           firstName,
           lastName,
           emailAddress,
           password,
           confirmPassword
       };
    
       // checks if confirmedPassword is equal to password, if it is then create new user
       if(user.confirmPassword === user.password){
        // handle promise
        context.data.createUser(user).then(() => {
            // resets form
           this.resetForm();
             //handle promise
            context.actions.signIn(user.emailAddress, user.password).then(user => {
                if(user){
                    history.push("/")
                }
            }).catch(error => {
                if(error.status === 500){
                    history.push('/error');
                }
            })


            // handle errors
        }).catch(errors => {
            if(errors.response.status === 400){
                this.setState(() => {
                    return {
                        errors: errors.response.data.error.errors
                    }
                })
            }else if(errors.response.status === 500){
                history.push('/error');
            }
        })
       }else{
            if(user.confirmPassword === ''){
                this.setState({errors: ["Please confirm password!"]})
            }
       }

     
    }

}

export default SignUp;