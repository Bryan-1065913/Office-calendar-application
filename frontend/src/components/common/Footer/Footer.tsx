// src/components/common/Footer/Footer.tsx
import React from 'react';
import { Container } from 'react-bootstrap';
import '../Footer/Footer.scss'

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark text-light py-3 mt-auto">
            <Container className="footer-logo">
                <p className="mb-1 text-begin"><img className="mb-0 text-" src="/src/assets/images/logo.png" alt="Logo" width="105" height="50"/></p>
            </Container>
            <Container className="copyright">
                <p className="mb-0 text-center">© 2025 Office Calendar App All right reserverd</p>
            </Container>
            <Container className="OPA">
                <p className="mb-0 text-end">Privacy Police</p>
            </Container>
        </footer>
    );
};

export default Footer;