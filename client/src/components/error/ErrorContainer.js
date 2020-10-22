import React, { Component } from "react";

/**
 * @extends {ErrorContainer} - React stateful component.
 * @constant {errors} - Array of error UI and details.
 */
class ErrorContainer extends Component{
    render(){
        const errors = this.props.errors.map((error, i) => (<li key={i.toString()}>{error}</li>))
        return(
            <div>
                <h2 className="validation--errors--label">{`${this.props.errorType}`} errors</h2>
                <div className="validation-errors">
                    <ul>
                        {errors}
                    </ul>
                </div>
            </div>
        )
    }
}
export default ErrorContainer;