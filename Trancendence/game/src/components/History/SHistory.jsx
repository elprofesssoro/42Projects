import React from "react";
import './History.css'
import Avatar from "../Elements/Avatar";

const SHistory = ({p_image, alt, p_name, p_score,p1_score, date, g_score, g_image, g_name, p2_score}) => {
    return (
        <div className="HisCon">
            <div className="hPlayers">
                <div>
                    <Avatar image={p_image} alt={alt} classN={"hImg"}/>
                </div>
                <div>
                    <h4>{p_name}</h4>
                    <p>{p1_score}</p>
                </div>
                <div>
                    <h3>{p_score}</h3>
                </div>
            </div>
            <div>
            <div className="date">
                <h6>{date} </h6>
            </div>
            </div>
            <div className="hPlayers">
                <div>
                    <h3>{g_score}</h3>
                </div>
                <div>
                    <h4>{g_name}</h4>
                    <p>{p2_score}</p>
                </div>
                <div>
                    <Avatar image={g_image} alt={alt} classN={"hImg"}/>
                </div>
            </div>
        </div>
    )
}

export default SHistory