import { NavLink, useLocation } from 'react-router-dom';
import PopUpMenu from '../DropDownMenu/PopUpMenu';
import Breadcrumbs from './Breadcrumbs';
const Navbar = () => {
	const location = useLocation();
	return (
		<>
			<navbar className ='navbar'>
				<div className ='navbar_text'>
					<p> IT </p>
				</div>
				<PopUpMenu />
				<Breadcrumbs/>
				<NavLink to="/MyCourses/Addnewquiz" className={location.pathname === "/NewQuiz" ? "active-link" : ""}>
					<button className='button_navbar'>TURN EDITING ON</button>
				</NavLink>
			</navbar>
		</>
	)
}

export default Navbar;
