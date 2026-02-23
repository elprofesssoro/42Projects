import React from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.css"



const PrivacyPolicy = () => {
	return (
		<div className="privacyPolicy">
			<Link to="/privacypolicy" >Privacy Policy</Link>
		</div>
	)
}


export default PrivacyPolicy