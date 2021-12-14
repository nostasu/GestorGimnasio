import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ShowGyms from "./ShowGyms";
import ShowAllFess from "../components/ShowAllFees"
import Error from '../components/Error';

const FormUser = (props) => {

    const [user, setUser] = useState({
        nombre: "",
        apellidos: "",
        telefono: "",
        email: "",
        password: "",
        fechaInicio: "",
        gimnasio: "",
        cuota: ""
    })
    const [fee, setFee] = useState();
    const [gym, setGym] = useState();
    // const [error, setError] = useState();

    const _handleSubmit = (e) => {
        e.preventDefault();
        if (props.handleSubmit) {
            props.handleSubmit({ ...user, cuota: fee, gimnasio: gym })
        }
        if (props.handleUpdate) {
            props.handleUpdate({ ...user, cuota: fee, gimnasio: gym })
        }
    }


    const handleChange = (e) => {
        setUser({
            ...user, //destructuracion formValues
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="container">
            <Form onSubmit={_handleSubmit}>
                <div className="row">
                    <Form.Group className=" mt-3 col-md-4" value={user.nombre} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0">Nombre</Form.Label>
                        <Form.Control type="string" name="nombre" placeholder="Nombre" />
                    </Form.Group>

                    <Form.Group className=" mt-3 col-md-8" value={user.apellidos} onChange={(e) => handleChange(e)}>
                        <Form.Label className="mb-0">Apellidos</Form.Label>
                        <Form.Control type="string" name="apellidos" placeholder="Apellidos" />
                    </Form.Group>
                </div>
                <div className="row mt-3">
                    <Form.Group className="mb-3 col-md-3" value={user.telefono} onChange={handleChange}>
                        <Form.Label className="mb-0"> Telefono </Form.Label>
                        <Form.Control type="string" name="telefono" placeholder="telefono" />
                    </Form.Group>

                    <Form.Group className="mb-3 col-md-6" value={user.email} onChange={handleChange}>
                        <Form.Label className="mb-0"> Email </Form.Label>
                        <Form.Control type="email" name="email" placeholder="email" />
                    </Form.Group>

                    <Form.Group className="mb-3 col-md-3" value={user.password} onChange={handleChange}>
                        <Form.Label className="mb-0"> Password </Form.Label>
                        <Form.Control type="password" name="password" placeholder="password" />
                    </Form.Group>
                </div>

                <div className="row">
                    <ShowGyms comesFrom={"showGym"} gym={gym} setGym={setGym} onChange={handleChange} />

                    {gym && <ShowAllFess comesFrom={"users"} fee={fee} setFee={setFee} gym={gym} onChange={handleChange} />}

                    <Form.Group className="mb-3 mt-3 col-md-3" value={user.fechaInicio} onChange={handleChange}>
                        <Form.Label className="mb-0"> Fecha Inicio Gym </Form.Label>
                        <Form.Control type="date" name="fechaInicio" placeholder="Fecha Inicio" />
                    </Form.Group>
                </div>
                <Button variant="primary" className="mb-2" type="submit"> Create! </Button>
            </Form>

            {props.error && <Error error={props.error} />}
        </div>


    )
}

export default FormUser;