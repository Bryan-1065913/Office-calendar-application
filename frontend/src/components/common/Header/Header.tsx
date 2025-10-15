// src/components/common/Header/Header.tsx

const Header = () => {
    return (
        <header
            className="d-flex fixed-top bg-white flex-wrap align-items-center justify-content-center justify-content-md-between py-3 border-bottom mb-5">
            <div className="col-md-3 mb-2 mb-md-0">
                <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                    <img src="/src/assets/images/logo.png" alt="Logo" width="105" height="50" />
                </a></div>
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li><a href="#" className="nav-link px-2 link-secondary">Home</a></li>
                <li><a href="/dashboard" className="nav-link px-2">Dashboard</a></li>
                <li><a href="#" className="nav-link px-2">Calendar</a></li>
                <li><a href="/events" className="nav-link px-2">Events</a></li>
            </ul>
            <div className="col-md-3 text-end">
                <a className="btn btn-outline-primary me-2" href="/login">Login</a>
                <a className="btn btn-primary" href="/register">Sign-up</a>
            </div>
        </header>
    );
};

export default Header;