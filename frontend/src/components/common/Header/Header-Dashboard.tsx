// src/components/common/Header/Header-Dashboard.tsx
import { Navbar, Container, Nav, Button } from "react-bootstrap";

type Props = { open: boolean; onToggle: () => void };

const HeaderDashboard = ({ open, onToggle }: Props) => {
    return (
        <Navbar expand="lg" className="dashboard-header" data-bs-theme="dark">
            <Container fluid>
                <Navbar.Brand>
                    <img src="/src/assets/images/logo.png" alt="Logo" width="105" height="50" />
                </Navbar.Brand>
                <div className="d-flex align-items-center gap-2">
                    <Nav className="d-none d-lg-flex">
                        <div className="dropdown text-end">
                            <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="/src/assets/images/default-user.svg" alt="Default user icon" width="32" height="32" className="rounded-circle"/>
                            </a>
                            <ul className="dropdown-menu text-small">
                                <li><a className="dropdown-item" href="#">New project...</a></li>
                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                <li><a className="dropdown-item" href="/pofile">Profile</a></li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li><a className="dropdown-item" href="#">Sign out</a></li>
                            </ul>
                        </div>
                    </Nav>
                    <Button
                        size="sm"
                        variant="outline-light"
                        className="d-lg-none"
                        onClick={onToggle}
                        aria-pressed={open}
                        aria-label="Toggle sidebar"
                    >
                        Menu
                    </Button>
                </div>
            </Container>
        </Navbar>
    );
};

export default HeaderDashboard;