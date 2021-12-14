import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const FormClass = ({ handleSubmit }) => {
    const [clase, setClase] = useState({
        tipoClase: "",
        fechaHora: "",
        maxAlumnos: "",
    })

    const _handleSubmit = (e) => {
        e.preventDefault();

        handleSubmit({ ...clase })
    }

    const handleChange = (e) => {
        setClase({
            ...clase, //destructuracion formValues
            [e.target.name]: e.target.value,
        })
    }

    const handleChangeClase = (e) => {
        setClase({
            ...clase,
            tipoClase: e.target.value,
        })
    }

    const handleChangeHour = (e) => {
        setClase({
            ...clase,
            fechaHora: e._d,
        })
    }

    return (
        <div className="container justify-content-center align-items-center">
            <Form onSubmit={_handleSubmit}>
                <div className="row mt-3">
                    <Form.Group className="mb-3" value={clase.tipoClase}>
                        <Form.Label className="mb-0">Tipo Clase</Form.Label>
                        <Form.Select onChange={(e) => handleChangeClase(e)}>
                            <option>Escoge el tipo de clase!</option>
                            <option name="tipoClase" value="Tacfit">Tacfit</option>
                            <option name="tipoClase" value="Clase en Grupo">Clase en Grupo</option>
                            <option name="tipoClase" value="Entrenamiento Personal">Entrenamiento Personal</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3 ">
                        <Form.Label className="mb-0"> FechaHora </Form.Label>
                        <Datetime
                            value={clase.fechaHora}
                            onChange={(e) => handleChangeHour(e)}
                            timeFormat={true}
                            name="fechaHora"
                            inputProps={{ placeholder: "Start Date" }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 col-md-4" value={clase.maxAlumnos} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0"> Maximo Numero Alumnos </Form.Label>
                        <Form.Control type="number" name="maxAlumnos" placeholder="Numero alumnos" />
                    </Form.Group>
                </div>
                <Button variant="primary" type="submit"> Create! </Button>

            </Form>

        </div >

    )
}

export default FormClass;