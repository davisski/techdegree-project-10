import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import ErrorContainer from "./error/ErrorContainer";


/**
 * @extends {UpdateCourse} - Extends react stateful component.
 * @method {componentDidMount} - React built in lifecycle method, invoked immediately after component is mounted.
 * @method {change} - Listens on input target name and value.
 * @method {submit} - Form submit method, create new course object and store it to database.
 */
class UpdateCourse extends Component{
    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: []
    }
    componentDidMount(){
        // Object destructuring
        const { match: {params: {id}}, context} = this.props;

        context.data.getCourseById(id).then(data => {
            // Pull out properties
            const {userId, title, description, estimatedTime, materialsNeeded} = data;

            // checks if course user id is not equal to authenticated user id then redirect to '/forbidden' route
            if(userId !== context.authenticatedUser.id){
               return this.props.history.push('/forbidden');
            }
            // checks if course have estimated time or have materials
            if(estimatedTime || materialsNeeded){
                this.setState(() => {
                    return {
                        title,
                        description,
                        estimatedTime,
                        materialsNeeded
                    }
                })
            }else{
                // if not, set only state title and description
                this.setState(() => {
                    return {
                        title,
                        description
                    }
                })
            }
         // Handle error   
        }).catch(error => {
            if(error.response.status === 404){
                this.props.history.push("/notfound");
            }else if(error.response.status === 500){
                this.props.history.push("/error");
            }            
        })
    }
    render(){
        // Object destructuring
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
                                    <p>By Joe Smith</p>
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
                                                    <textarea onChange={this.change} id="materialsNeeded" value={materialsNeeded} name="materialsNeeded" placeholder="Materials needed..."></textarea>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                        <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><Link to={`/`} className="button button-secondary">Cancel</Link></div>
                    </form>
                </div>
            </div>
        )
    }
    // Listen to input change
    change = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // set input target name to value
        this.setState(() => {
            return{
                [name]: value
            }
        })
    }
    // On form submit method
    submit = (e) => {
        e.preventDefault();
        // object destructuring
        const {title, description, estimatedTime, materialsNeeded} = this.state;
        
        // create new course object
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded
        }
        
        //object destructuring
        const { match: {params: {id}}, context} = this.props;
        // authenticated user
        const authUser = context.authenticatedUser;

        // Handle promise
        context.data.updateCourse(id, course, authUser).then(() => {
            // if everything okey redirect back to course by id
            this.props.history.push(`/courses/${id}`);
          
        // Handle errors    
        }).catch(error => {
            if(error.response.status === 400){
                this.setState(() => {
                    return {
                        errors: error.response.data.error.errors
                    }
                })
            }else if(error.response.status === 403){
                this.props.history.push('/forbidden');
            }else if(error.response.status === 500){
                this.props.history.push("/error");
            }
        });

    }
}

export default withRouter(UpdateCourse);