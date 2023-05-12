import { NavLink, useLocation } from 'react-router-dom';
import DropDownMenu from '../DropDownMenu/DropDownMenu';

const Navbar = () => {
	const location = useLocation();
	return (
		<>
			<navbar className ='navbar'>
				<div className ='navbar_text'>
					<p> IT </p>
				</div>
				<DropDownMenu />
				<div className="navbar_menu">
					<ul className='menu'>
						<li>
							<NavLink to="/Home" className={location.pathname === "/Home" ? "active-link" : ""}> Home</NavLink>
						</li>
						<li> / </li>
						<li>
							<NavLink to="/MyCourses" className={location.pathname === "/MyCourses" ? "active-link" : ""}> My Courses</NavLink>
						</li>
						<li> / </li>
						<li>
							<NavLink to="/Thicuoiki" className={location.pathname === "/Thicuoiki" ? "active-link" : ""}> THI CUỐI KÌ</NavLink>
						</li>
					</ul>
				</div>
				<NavLink to="/Addnewquiz" className={location.pathname === "/Newquiz" ? "active-link" : ""}>
					<button className='button_navbar'>TURN EDITING ON</button>
				</NavLink>
			</navbar>
		</>
	)
}

export default Navbar;
