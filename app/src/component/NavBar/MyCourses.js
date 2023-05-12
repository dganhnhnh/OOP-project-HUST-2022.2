import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
const MyCourses = () => {
  const location = useLocation();
  return (
    <div>
      <NavLink to='general/thicuoiki2moncongnghe' className={location.pathname === '/Quiz_61' ? "active-link" : ""}>
        thicuoiki2moncongnghe
      </NavLink>
    </div>

  )
}

export default MyCourses