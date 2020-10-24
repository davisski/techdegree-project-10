import React, { Component } from 'react';
import {Link} from "react-router-dom";
import ErrorContainer from "./error/ErrorContainer";

/**
 * @extends{CreateCourse} - Extends react stateful component.
 * @method {componentDidMount} - React built in lifecycle method, invoked immediately after component is mounted.
 * @method {change} - Listens to input target name and value. Sets state base on input name and value.
 * @method {submit} - Handle form submission, store newly created course to database.
 */
class CreateCourse extends Component{
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: []
    }
    componentDidMount(){
        const {context} = this.props;

        
        // cheks if user is not autheticated then redirect to signin route
        // if(!context.authenticatedUser){
        //     this.props.history.push('/signin');
        // }
    }
    render(){
        // pull out properties from state object 
        const { title, description, estimatedTime, materialsNeeded, errors} = this.state;
        return (
            <div className="bounds course--details">
                <h1>Create Course</h1>
                <div>
                    {errors.length ? <ErrorContainer errorType="Validation" errors={errors} /> : '' }
                    <form onSubmit={this.submit}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input onChange={this.change} value={title} id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."/>
                                </div>
                            </div>
                            <div className="course--description">
                                <div><textarea onChange={this.change} id="description" value={description} placeholder="Course description..." name="description"></textarea></div>
                            </div>
                            </div>

                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div>
                                                    <input onChange={this.change} id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={estimatedTime}/>                        
                                                </div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div>
                                                    <textarea id="materialsNeeded" name="materialsNeeded" placeholder="Materials needed..." value={materialsNeeded} onChange={this.change}></textarea>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                        <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button><Link to={`/`} className="button button-secondary">Cancel</Link></div>
                    </form>
                </div>
            </div>
        )
    }
    change = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState(() => {
            return {
                [name]: value
            }
        })
    }
   
    submit = (e) => {
        e.preventDefault();
        
        const {context} = this.props;
        // auth user
        const authUser = context.authenticatedUser;

        // checks if authenticated user
        if(authUser){
            // pull out properties from state object
            const {title, description, estimatedTime, materialsNeeded} = this.state;

            // Create new course object, and identify course creator by setting userId to autheticated user. 
            const course = {
                title,
                description,
                estimatedTime,
                materialsNeeded,
                userId: authUser.id
            }

            // handle promise
            context.data.createCourse(course, authUser).then(() => {
                this.props.history.push('/');
            // handle errors
            }).catch(error => {
                if(error.response.status === 400){
                    this.setState(() => {
                        return {
                            errors: error.response.data.error.errors
                        }
                    })
                }else if(error.response.status === 500){
                    this.props.history.push('/error');
                }
            })
        }
    }
}

export default CreateCourse;