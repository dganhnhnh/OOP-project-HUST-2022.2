import React from 'react'
import { Link } from 'react-router-dom'
const Quiz = ({ quiz }) => {
	return (
		<div>
			<article className="quiz">
				<Link to={`/quiz/${quiz.name}`}>
					<h2>{quiz.name}</h2>
				</Link>
			</article>
		</div>
	)
}

export default Quiz