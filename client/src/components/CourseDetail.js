import React, {Component} from "react";
import {NavLink, withRouter} from "react-router-dom";
import ReactMarkdown from "react-markdown";


/**
 * @extends {CourseDetail} - Extends react stateful component.
 * @method {componentDidMount} - React built in lifecycle method, invoked immediately after component is mounted.
 * @method {materialsNeeded} - Returns materials UI.
 * @method {estimatedTime} - Returns estimated time UI.
 * @method {delete} - Delete course.
 */
class CourseDetail extends Component{
    state = {
        course: {}
    }
    componentDidMount(){
      // object destructuring
        const { match: {params: {id}}, context} = this.props;
      
        // handle promise
        context.data.getCourseById(id).then(data => {
              this.setState(() => {
                return {
                    course: data
                }
              })
          }).catch(error => {
            if(error.response.status === 404){
              this.props.history.push('/notfound');
            }
            if(error.response.status === 500){
              this.props.history.push('/error');
            }
        })
    }
    /**
     * 
     * @param {course} - Course object.
     *  
     */
    materialsNeeded = (course) => {
      return (
        <li className="course--stats--list--item">             
            <h4>Materials Needed</h4>
            <ul>
              <ReactMarkdown source={course.materialsNeeded} />         
            </ul>
        </li>
      )
    }
    /**
     * 
     * @param {time} - Number.
     */
    estimatedTime = (time) => {
      return (
        <li className="course--stats--list--item">
            <h4>Estimated Time</h4>
            <h3>{`${time}`}</h3>
        </li>
      )
    } 
    render(){
        const {course} = this.state;
        const {user} = course;
        const {context} = this.props;
        return (
            <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {context.authenticatedUser && course.userId === context.authenticatedUser.id ? (<span><NavLink className="button" to={`/courses/${course.id}/update`}>Update Course</NavLink><NavLink className="button button-danger" to={`/courses/${course.id}`} onClick={() => this.delete(course.userId)}>Delete Course</NavLink><NavLink className="button button-secondary" to={`/`}>Return to List</NavLink></span>) : <NavLink className="button button-secondary" to={`/`}>Return to List</NavLink>}
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>{`By ${user ? user.firstName : ''} ${user ? user.lastName : ''}`}</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={course.description} />
            </div>
          </div>
         
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                {
                  course.estimatedTime ? this.estimatedTime(course.estimatedTime) : ''
                }
                {
                  course.materialsNeeded ? this.materialsNeeded(course) : ''
                }
                
              </ul>
            </div>
          </div>
        </div>
      </div>
        )
    }
    /**
     * @function - Delete course if user id match with course object user id.
     * @param {userId} - User id.
     * @constant {authUser} - Store authenticatedUser.
     * 
     */
    delete = (userId) => {
      
      // Object destructuring
      const { match: {params: {id}}, context} = this.props;

      const authUser = context.authenticatedUser;
    
      // Checks if course user id is equal to authenticatedUser id. Execute code base on if else statement.
      if(userId === authUser.id){
        // handle promise
        context.data.deleteCourse(id, authUser).then(() => {
            this.props.history.push('/');
        // handle errors
        }).catch(error => {
            if(error.response.status === 403){
              this.props.history.push('/forbidden');
            }else if (error.response.status === 500){
              this.props.history.push('/error');
            }
        }) 
      }
    }
}

export default withRouter(CourseDetail);