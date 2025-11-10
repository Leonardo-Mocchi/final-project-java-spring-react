import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">
                    &copy; {currentYear} BoolArcade - All Rights Reserved
                </p>
                <p className="footer-subtext">
                    Student Project • Built with React & Spring Boot
                </p>
            </div>
        </footer>
    );
}

export default Footer;
