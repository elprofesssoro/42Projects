import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css"


const AdminNav = () => {
    return(
     <nav className="admin-nav">
        <Link to="/admin" >Users</Link>
        <Link to="/admin/invites" >Invites</Link>
        <Link to="/admin/matches" >Matches</Link>
        <Link to="/admin/tournament-subs">Tournaments</Link>
        <Link to="/admin/audit" >Audit</Link>
      </nav>
    )
}

export default AdminNav