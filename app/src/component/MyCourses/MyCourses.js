import React from 'react'

const MyCourses = () => {
  const handleClick = () => {
    console.log('hello');
  }
  return (
    <div>
      MyCourses
      <button onClick={handleClick()}> TURN EDITING ON </button>
      <button className='button_mycourse'> jbugb </button>
    </div>
    
  )
}

export default MyCourses