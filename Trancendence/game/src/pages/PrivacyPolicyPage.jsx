import React from "react";
import Hero from "../components/Hero.jsx"



const TermsConditions = () => {
	return (
		<div>
			<Hero hero="profileHero"/>
			<h1>Privacy Policy</h1>
				<div className="privacyPolicy-container">
				  <div>
					<p><strong>Date:</strong> January 22, 2026</p>
					<p><strong>Developers:</strong> lfabel, idvinov, vvelikov, School Project at 42Wolfsburg, Wolfsburg, Germany</p>
					<h2>🔒 Privacy Policy</h2>
					<p>This game collects for accounts:</p>
					<div>Name (leaderboard)</div>
					<div>Country</div>
					<div>Gender</div>
					<div>Email</div>
					<p><strong>Storage:</strong> Local database on school PC only. No external sharing.</p>
					<p><strong>Purpose:</strong> Accounts & leaderboards.</p>
					<p><strong>Retention:</strong> Deleted post-project.</p>
					<p><strong>Rights:</strong> View/edit/delete anytime – email pong@42wolfsburg.de</p>
					<p><strong>Security:</strong> Local, no internet access.</p>
				  </div>
				  <div>
					<h2>📜 Terms of Service</h2>
					<p>By playing/account creating, you agree:</p>
					<h3>1. Description</h3>
					<p>Local school Pong game. See Privacy above.</p>
					<h3>2. Eligibility</h3>
					<p>School-focused, open to all.</p>
					<p>Supervised play advised.</p>
					<h3>3. Conduct</h3>
					<p>No cheating/harassment.</p>
					<p>No commercial use.</p>
					<h3>4. Accounts</h3>
					<p>Accurate info.</p>
					<p>Deletable for violations.</p>
					<h3>5. IP</h3>
					<p>Play locally only; owned by team.</p>
					<h3>6. Liability</h3>
					<p>"As is"; no guarantees/liability.</p>
					<h3>7. Termination</h3>
					<p>Suspendable; quit anytime.</p>

					<h3>8. Changes</h3>
					<p>Updates possible.</p>
				  </div>
				  <br/>
				  <br/>
				  <br/>
					<p><strong>Contact:</strong> pong@42wolfsburg.de | Thanks for exploring and enjoying our project!</p>
				</div>
		</div>
	)
}

export default TermsConditions