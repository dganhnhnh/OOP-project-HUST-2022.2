import { NavLink, useLocation } from 'react-router-dom';
import DropDownMenu from './DropDownMenu';

const Navbar = () => {
	const location = useLocation();
	return (
		<>
			<navbar class='navbar'>
				<div class='navbar_text'>
					<p> IT </p>
				</div>
				<DropDownMenu/>
				<div className="navbar_menu">
					<ul className='menu'>
						<li>
							<NavLink to="/Home" className ={location.pathname === "/Home" ? "active-link" : ""}> Home</NavLink>
						</li>
						<li> / </li>
						<li>
							<NavLink to="/MyCourses" className= {location.pathname === "/MyCourses" ? "active-link" : ""}> My Courses</NavLink>
						</li>
						<li> / </li>
						<li>
							<NavLink to="/Thicuoiki" className={location.pathname === "/Thicuoiki" ? "active-link" : ""}> THI CUỐI KÌ</NavLink>
						</li>
					</ul>
				</div>
				<button>TURN EDITING ON</button>
			</navbar>
		</>
	)
}

export default Navbar;
