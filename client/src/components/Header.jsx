
import "./stylesComponents/header.css"
import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import { Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
    const [expanded, setExpanded] = useState(false);
    return (
        <Navbar expanded={expanded} bg="light" expand="md">
            <Container fluid>
                <Navbar.Brand href="http://localhost:3000">Gestor Reservas</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" onClick={() => setExpanded(expanded ? false : "expanded")} />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Link to="/" onClick={() => setExpanded(false)} className="nav-link">Home</Link>
                        <Link to="/NuestrosCentros" onClick={() => setExpanded(false)} className="nav-link"> Nuestros Centros</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;