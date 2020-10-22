import React, {Component} from 'react';
import "./global.css";
import Header from "./components/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Courses from './components/Courses';
import NotFound from "./components/error/NotFound";
import CourseDetail from './components/CourseDetail';
import UpdateCourse from './components/UpdateCourse';
import CreateCourse from './components/CreateCourse';
import withContext from './Context';
import UnhandleError from './components/error/UnhandleError';
import Forbidden from './components/error/Forbidden';
import SignOut from './components/SignOut';
import PrivateRoute from './PrivateRoute';

const SignUpWithContext = withContext(SignUp);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const SignInWithContext = withContext(SignIn);
const HeaderWithContext = withContext(Header);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const SignOutWithContext = withContext(SignOut);


class App extends Component {
  render(){
    return (
      <Router>
        <div className="App">
          <HeaderWithContext />
          <Switch>
            <Route exact path="/" component={CoursesWithContext} />
            <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
            <PrivateRoute exact path="/courses/:id/update" component={UpdateCourseWithContext} />
            <Route exact path="/courses/:id" component={CourseDetailWithContext}/>
            <Route exact path="/signup" component={SignUpWithContext}/>
            <Route exact path="/signin" component={SignInWithContext}/>
            <Route exact path="/signout" component={SignOutWithContext} />
            <Route exact path="/forbidden" component={Forbidden} />
            <Route exact path="/notfound" component={NotFound} />
            <Route exact path="/error" component={UnhandleError} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
