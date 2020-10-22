import React, {Component} from "react";
import {Link} from "react-router-dom";

/**
 * @extends {Courses} - Extends react stateful component.
 * @method {componentDidMount} - React built in lifecycle method, invoked immediately after component is mounted.
 */
export default class Courses extends Component {
    state = {
        courses: []
    }
    componentDidMount() {
        const {context} = this.props;
        // handle promise
        context.data.getCourses().then(data => {
            this.setState(() => {
                return {
                    courses: data
                }
            })
        // handle error
        }).catch(error => {
            if(error.respones.status === 500){
                this.props.history.push("/error");
            }
        })
    }
    render(){
        // transforms state object courses array into new array of courses UI and details
        const courses = this.state.courses.map(course => this.coursesTemplate(course));
        
        return(
            <div className="bounds">
                {courses}
                <div className="grid-33"><Link className="course--module course--add--module" to={`/courses/create`}>
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 13 13" className="add">
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </Link></div>
            </div>
            
        )
    }
    /**
     * 
     * @param {course} - Course object
     * @returns - Course UI 
     */
    coursesTemplate = (course) => {
        return(
            <div key={course.id.toString()} className="grid-33"><Link className="course--module course--link" to={`/courses/${course.id}`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </Link></div>
        )
    }


}