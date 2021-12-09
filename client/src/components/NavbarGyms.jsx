import React from 'react';
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';



const NavbarPpal = () => {

    return (
        <Nav defaultActiveKey="/" as="ul">
            <Nav.Item as="li">
                <i className="bi bi-house-fill" />
                <Nav.Link> <Link to="/MiCentro" /> Mi Centro</Nav.Link>
            </Nav.Item>

            <Nav.Item as="li">
                <i className="bi bi-credit-card-fill"></i>
                <Nav.Link eventKey="link-1">Cuotas</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <i className="bi bi-calendar-check"></i>
                <Nav.Link eventKey="link-2">Reservas</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default NavbarPpal
