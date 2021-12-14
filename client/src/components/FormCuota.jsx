import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const FormCuota = ({ handleSubmit }) => {
    const [fee, setFee] = useState({
        nombre: "",
        precio: "",
        clases: "",
    })

    const _handleSubmit = (e) => {
        e.preventDefault();

        handleSubmit({ ...fee })
    }

    const handleChange = (e) => {
        // //e tiene la informacion del input que desencadena el change
        setFee({
            ...fee, //destructuracion formValues
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="container justify-content-center align-items-center">
            < Form onSubmit={_handleSubmit} >
                <div className="row mt-3">
                    <Form.Group className="mb-3" value={fee.nombre} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0">Nombre de la Cuota</Form.Label>
                        <Form.Control type="string" name="nombre" placeholder="nombre cuota" />
                    </Form.Group>

                    <Form.Group className="mb-3" value={fee.precio} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0"> Precio Cuota </Form.Label>
                        <Form.Control type="string" name="precio" placeholder="precio" />
                    </Form.Group>


                    <Form.Group className="mb-3" value={fee.clases} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0">Numero Clases</Form.Label>
                        <Form.Control type="string" name="clases" placeholder="Numero clases" />
                    </Form.Group>

                </div>
                <Button variant="primary" type="submit"> Create! </Button>

            </Form >
        </div >

    )
}

export default FormCuota;