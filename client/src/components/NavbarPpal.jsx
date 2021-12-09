import React from 'react';
import "./stylesComponents/navbarPpal.css"
import Nav from 'react-bootstrap/Nav'


const NavbarPpal = () => {

    return (
        <Nav defaultActiveKey="/home" as="ul">
            <Nav.Item as="li">
                <i className="bi bi-person-circle"><Nav.Link href="/home">Mi cuenta</Nav.Link></i>
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
