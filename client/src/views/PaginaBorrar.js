import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link, useLocation } from 'react-router-dom'


const PaginaBorrar = () => {
    const location = useLocation();
    const { from } = location.state;

    const BorraUsuarioOGym = () => {
        if (from === "usuario") {
            return (
                <Link to={"/BorrarDefinitivamenteUsuario"}>
                    <Button variant="primary"> Estoy Seguro </Button>
                </Link>
            )
        } return (
            <Link to={"/BorrarDefinitamenteGimnasio"}>
                <Button variant="primary"> Estoy Seguro </Button>
            </Link>
        )
    }

    return (
        <div>

            <div className="alert alert-primary mt-3" role="alert">
                Estas completamente seguro de que quieres borrar tu {from}? <br />
                Esta acción no es irreversible!
            </div>
            {BorraUsuarioOGym()}

        </div>
    )
}

export default PaginaBorrar
