import { AiFillSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
const Navbar = () => {
	return (
		<>
			<navbar class='navbar'>
				<div class='navbar_text'>
					<p> IT </p>
					<a href='#' > <AiFillSetting /> </a>
				</div>
				<div className="navbar_menu">
					<ul className='menu'>
						<li>
							<Link to="/" activeClassName='active'>Home</Link>
						</li>
						<li> / </li>
						<li>
							<Link to="MyCourses" activeClassName='active'>MyCourses</Link>
						</li>
						<li> / </li>
						<li>
							<Link to="Thicuoiki" activeClassName='active'>Thi cuoi ki</Link>
						</li>
					</ul>
				</div>

			</navbar>
		</>
	)
}

export default Navbar;
