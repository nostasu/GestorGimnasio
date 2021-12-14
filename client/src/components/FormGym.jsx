import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Error from '../components/Error';
import Chip from '@mui/material/Chip';

const FormGym = (props) => {

    const [newGym, setGym] = useState({
        nombreCentro: "",
        password: "",
        direccion: "",
        logo: "",
        entrenadores: []
    })

    const [entrenador, setEntrenador] = useState({
        nombreApellidos: "",
        edad: ""
    })

    const inputFileRef = useRef();

    const _handleSubmit = (e) => {
        e.preventDefault();
        if (props.handleSubmit) { props.handleSubmit({ ...newGym, logo: inputFileRef.current.files[0] }) }
        if (props.handleUpdate) { props.handleUpdate({ ...newGym, logo: inputFileRef.current.files[0] }) }
    }

    const handleChange = (e) => {

        setGym({
            ...newGym, //destructuracion formValues
            [e.target.name]: e.target.value,
        })
    }

    const changeEntrenadores = (e) => {
        setEntrenador({
            ...entrenador,
            [e.target.name]: e.target.value,
        })
    }

    const añadirEntrenador = () => {
        if (entrenador !== "") {
            setGym({
                ...newGym,
                entrenadores: [...newGym.entrenadores, entrenador]
            });
        }
    }

    const handleDelete = (e, i) => {
        e.preventDefault();
        console.log(i);
        let newArray = [...newGym.entrenadores];
        console.log("entrenadores", newArray);
        newArray.splice(i, 1);

        setGym({
            ...newGym,
            entrenadores: newArray
        });

        console.log(newGym);
    }

    return (
        <div className="container">
            <Form onSubmit={_handleSubmit}>
                <div className="row">
                    <Form.Group className="mt-3 col-lg-4" value={newGym.nombreCentro} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0">Nombre Centro</Form.Label>
                        <Form.Control type="string" name="nombreCentro" placeholder="nombreCentro" />
                    </Form.Group>

                    <Form.Group className="mt-3 col-lg-8" controlId="formBasicPassword" value={newGym.password} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0"> Password </Form.Label>
                        <Form.Control type="password" name="password" placeholder="password" />
                    </Form.Group>
                </div>
                <div className="row mt-3">

                    <Form.Group className="mb-3 col-lg-8" value={newGym.direccion} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0"> Dirección </Form.Label>
                        <Form.Control type="string" name="direccion" placeholder="direccion" />
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-3 col-lg-4" value={newGym.logo} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0"> Introduce el logo de tu centro </Form.Label>
                        <Form.Control type="file" name="logo" ref={inputFileRef} />
                    </Form.Group>
                </div>
                <div className="row entrenadores align-items-center justify-content-sm-center">
                    {/* value entrenador */}
                    <Form.Group className="mb-2 col-lg-8" value={newGym.entrenadores} onChange={changeEntrenadores}>
                        <Form.Label className="mb-0">Nombre Entrenador</Form.Label>
                        <Form.Control type="string" name="nombreApellidos" placeholder="NombreApellidos" />
                    </Form.Group>

                    <Form.Group className="mb-2 col-lg-4" value={newGym.entrenadores} onChange={changeEntrenadores}>
                        <Form.Label className="mb-0">Edad Entrenador</Form.Label>
                        <Form.Control type="string" name="edad" placeholder="Edad" />
                    </Form.Group>
                    <div>
                        <Button type="button" variant="primary" size="sm" className="btn mt-3 col-lg-2 col-sm-2" onClick={añadirEntrenador}>Añadir Entrenador</Button>
                    </div>
                </div>

                <div className="row mt-3 align-items-center">

                    {newGym.entrenadores.map((entrenador, i) => {
                        return (
                            <div key={i} className="col-sm-3 col-xs-2 mt-3">
                                <Chip
                                    label={entrenador.nombreApellidos}
                                    variant="outlined"
                                    color="primary"
                                    onDelete={(e) => handleDelete(e, i)}
                                />
                            </div>
                        )
                    })
                    }

                </div>

                <Button variant="primary" className="mt-3 mb-2" type="submit"> Submit! </Button>
            </Form >

            {props.error && <Error error={props.error} />}
        </div >

    )
}

export default FormGym;