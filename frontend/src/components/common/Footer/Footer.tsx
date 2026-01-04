// src/components/common/Footer/Footer.tsx
import React from 'react';
import '../../../styles/General/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-row">
                <div className="footer-logo">
                    <img src="/src/assets/images/logo.png" alt="Logo" />
                </div>

                <p className="mb-0">© 2026 Office Calendar App All rights reserved</p>

                <p className="mb-0">Privacy Policy</p>
            </div>
        </footer>
    );
};

export default Footer;