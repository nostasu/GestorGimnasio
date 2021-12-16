import React from 'react';
import Navbar from "react-bootstrap/Navbar"
import { Link } from 'react-router-dom';

const NavbarPpal = (props) => {
    const gymOrUser = () => {
        if (props.gym) {
            return (
                <Link to="/MyGym" className="d-flex flex-column"><i className="bi bi-person-circle d-flex-column h5 mb-0"></i>Mi cuenta</Link>
            )
        } return (
            <Link to="/MyUser" className="d-flex flex-column"><i className="bi bi-person-circle d-flex-column h5 mb-0"></i>Mi cuenta</Link>
        )
    }

    return (
        <Navbar className='fixed-bottom justify-content-around mb-1 navBarPpal'>
            {gymOrUser()}
            <Link to="/" className="d-flex flex-column"><i className="bi bi-house-door-fill"></i> Pagina Inicio</Link>
        </Navbar >
    );
}

export default NavbarPpal
