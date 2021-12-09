import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ShowGyms from "./ShowGyms";
import ShowAllFess from "../components/ShowAllFees"

const FormUser = ({ handleSubmit }) => {

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

    const _handleSubmit = (e) => {
        e.preventDefault();
        console.log(fee);
        console.log(gym);
        handleSubmit({ ...user, cuota: fee, gimnasio: gym })
    }

    const handleChange = (e) => {
        console.log(e.target);
        //e tiene la informacion del input que desencadena el change
        setUser({
            ...user, //destructuracion formValues
            [e.target.name]: e.target.value
        })
        console.log(user);
    }

    return (
        <Form onSubmit={_handleSubmit}>

            <Form.Group className="mb-3 mt-3" value={user.nombre} onChange={(e) => handleChange(e)}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="string" name="nombre" placeholder="Nombre" />
            </Form.Group>

            <Form.Group className="mb-3 mt-3" value={user.apellidos} onChange={(e) => handleChange(e)}>
                <Form.Label>Apellidos</Form.Label>
                <Form.Control type="string" name="apellidos" placeholder="Apellidos" />
            </Form.Group>

            <Form.Group className="mb-3" value={user.telefono} onChange={handleChange}>
                <Form.Label> Telefono </Form.Label>
                <Form.Control type="string" name="telefono" placeholder="telefono" />
            </Form.Group>

            <Form.Group className="mb-3" value={user.email} onChange={handleChange}>
                <Form.Label> Email </Form.Label>
                <Form.Control type="email" name="email" placeholder="email" />
            </Form.Group>

            <Form.Group className="mb-3" value={user.password} onChange={handleChange}>
                <Form.Label> Password </Form.Label>
                <Form.Control type="password" name="password" placeholder="password" />
                <Form.Text className="text-muted">
                    We'll never share your password with anyone else.
                </Form.Text>
            </Form.Group>

            <ShowGyms comesFrom={"showGym"} gym={gym} setGym={setGym} onChange={handleChange} />

            <ShowAllFess fee={fee} setFee={setFee} onChange={handleChange} />


            <Form.Group className="mb-3" value={user.fechaInicio} onChange={handleChange}>
                <Form.Label> Fecha Inicio Gym </Form.Label>
                <Form.Control type="date" name="fechaInicio" placeholder="Fecha Inicio" />
            </Form.Group>

            <Button variant="primary" type="submit"> Create! </Button>
        </Form>


    )
}

export default FormUser;