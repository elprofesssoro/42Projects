import React from "react";
import { Link } from "react-router-dom";

const Button = ({dest, children}) =>{
    return (
        <div className="button">
            <Link to={dest}>{children}</Link>
        </div>
    )
}

export default Button