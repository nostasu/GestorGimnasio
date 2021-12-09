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
        console.log(e);
        setClase({
            ...clase, //destructuracion formValues
            [e.target.name]: e.target.value,
        })
        console.log(clase);
    }

    const handleChangeClase = (e) => {
        console.log(e);
        setClase({
            ...clase,
            tipoClase: e.target.value,
        })
        console.log(clase);
    }

    const handleChangeHour = (e) => {
        console.log(e._d);
        setClase({
            ...clase,
            fechaHora: e._d,
        })
    }

    return (
        <div>
            <Form onSubmit={_handleSubmit}>

                <Form.Group className="mb-3" value={clase.tipoClase}>
                    <Form.Label>Tipo Clase</Form.Label>
                    <Form.Select onChange={(e) => handleChangeClase(e)}>
                        <option>Escoge el tipo de clase!</option>
                        <option name="tipoClase" value="Tacfit">Tacfit</option>
                        <option name="tipoClase" value="Clase en Grupo">Clase en Grupo</option>
                        <option name="tipoClase" value="Entrenamiento Personal">Entrenamiento Personal</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label> FechaHora </Form.Label>
                    <Datetime
                        value={clase.fechaHora}
                        onChange={(e) => handleChangeHour(e)}
                        timeFormat={true}
                        name="fechaHora"
                        inputProps={{ placeholder: "Start Date" }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" value={clase.maxAlumnos} onChange={(e) => handleChange(e)}>
                    <Form.Label> Maximo Numero Alumnos </Form.Label>
                    <Form.Control type="number" name="maxAlumnos" placeholder="Numero alumnos" />
                </Form.Group>

                <Button variant="primary" type="submit"> Create! </Button>

            </Form>

        </div >

    )
}

export default FormClass;