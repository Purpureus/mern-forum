import Navbar from './Navbar';

const Header = () => {

	return (
		<div className="header-section">
			<header>
				<h1 className="forum-title">Forum title</h1>
				<h2 className="forum-subtitle">Forum subtitle</h2>
			</header>
			<Navbar></Navbar>
		</div>
	);
}

export default Header;