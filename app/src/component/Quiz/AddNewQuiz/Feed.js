import React from 'react'
import Quiz from'./Quiz';
const Feed = ({quizs}) => {
  return (
	<>
	{quizs.map(quiz => (
		<Quiz key={quiz.name} quiz={quiz} />
	))}
</>
  )
}

export default Feed