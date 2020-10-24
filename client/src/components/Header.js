import React, { PureComponent, Fragment } from "react";
import {NavLink, Link} from "react-router-dom";

/**
 * @extends {Header} - React pure component, which updates himself base on prop and state comparison.
 */
class Header extends PureComponent{
  render(){
    // object destructuring
    const {context, location} = this.props;
    const authUser = context.authenticatedUser;
    return (
      <div className="header">
      <div className="bounds">
        <h1 className="header--logo">Courses</h1>
        <nav>
        {
          // checks if user is authenticated, render UI base on conditional (ternary) aperator.
          authUser ? 
            <Fragment>
              <span>Welcome {authUser.firstName} {authUser.lastName}</span><NavLink className="signout" to={`/signout`}>Sign Out</NavLink>
            </Fragment> :
            <Fragment>
              <NavLink className="signup" to={`/signup`}>Sign Up</NavLink><Link className="signin" to={{pathname: '/signin', state: {from: location}}}>Sign In</Link>
            </Fragment>
        }
      </nav>
    </div>
    </div>
    )
  }
}

export default Header;