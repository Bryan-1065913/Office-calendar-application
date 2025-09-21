import { Navbar, Container, Nav, Button } from "react-bootstrap";
import {NavLink} from "react-router";
import {useState} from "react";

const HeaderDashboard = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`dashboard-layout ${open ? "is-sidebar-open" : ""}`}>
            <Navbar expand="lg" className="dashboard-header" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand><img src="/src/assets/images/logo.jpeg" alt="Logo" width="75" height="75" /></Navbar.Brand>
                    <div className="d-flex align-items-center gap-2">
                        <Nav className="d-none d-lg-flex">
                            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                        </Nav>
                        <Button
                            size="sm"
                            variant="outline-light"
                            className="d-lg-none"
                            onClick={() => setOpen(v => !v)}
                            aria-label="Toggle sidebar"
                        >
                            Menu
                        </Button>
                    </div>
                </Container>
            </Navbar>
        </div>
    );
};

export default HeaderDashboard;