import React from "react";
import { Link } from "react-router-dom";
import { GiTrophyCup } from "react-icons/gi";


const SNextTournament = ({t_name, t_date}) => {
    return (
        <div className="SNTour">
        <h3>{t_name}</h3>
        <GiTrophyCup className="trophy"/>
        <p className="tDate_2">Date: {t_date}</p>
        <div className="tJoin">
            <Link to="/tournament/private/jointournament">Join</Link>
        </div>
        </div>
    )
}

export default SNextTournament