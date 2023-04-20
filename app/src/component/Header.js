import { FiMenu } from 'react-icons/fi';
import { BiUserCircle } from 'react-icons/bi';
const Header = () => {

	return (
		<header className='header'>
			<FiMenu />
			<div className='account'><BiUserCircle /></div>
		</header>
	)
}

export default Header;
