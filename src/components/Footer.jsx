const Footer = () => {
	return (
		<footer
			className="glassy-footer text-center mt-5 py-3"
			style={{
				width: '100%',
				background: 'linear-gradient(90deg, #e0e7ef 0%, #f8fafc 100%)',
				borderTopLeftRadius: '1.5rem',
				borderTopRightRadius: '1.5rem',
				boxShadow: '0 -2px 16px rgba(31,38,135,0.06)',
				fontFamily: 'Comfortaa, cursive',
				fontSize: '1.05rem',
				color: '#222',
				position: 'relative',
				bottom: 0,
				left: 0,
				zIndex: 100,
			}}
		>
			<span>
				&copy; {new Date().getFullYear()} OtisFuse AI Chat &mdash;{' '}
				<a href="https://store.steampowered.com/search/?publisher=Otis%20Fuse%20Productions" style={{ color: '#3b82f6', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
					Otis Fuse Productions
				</a>
			</span>
		</footer>
	);
};

export default Footer;
