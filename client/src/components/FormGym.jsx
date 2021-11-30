import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReactChipInput from "react-chip-input";

const FormGym = ({ handleSubmit }) => {
    const [newGym, setGym] = useState({
        nombreCentro: "",
        password: "",
        direccion: "",
        logo: "",
        entrenadores: []
    })

    // const [chip, setChip] = useState();

    const inputFileRef = useRef();

    const _handleSubmit = (e) => {
        e.preventDefault();

        handleSubmit({ ...newGym, logo: inputFileRef.current.files[0] })
    }

    const handleChange = (e) => {
        if (e.target.name === "entrenadores") {
            //Toda la cadena de caracteres, la dividimos por comas
            let cadena = e.target.value;

            let cadenaSeparada = cadena.split(',');
            console.log(cadenaSeparada);

            let entrenador = {
                nombreApellidos: " ",
                edad: " "
            }
            cadenaSeparada.forEach((element, i) => {
                if (i === 0 || i % 2 === 0) {
                    entrenador.nombreApellidos = element
                }
                console.log(`impar ${e.target.name}`);
                entrenador.edad = element
                console.log(entrenador);
                setGym({
                    ...newGym, //destructuracion formValues
                    [e.target.name]: entrenador
                })
            })

        }
        // //e tiene la informacion del input que desencadena el change
        setGym({
            ...newGym, //destructuracion formValues
            [e.target.name]: e.target.value
        })
        console.log(newGym);
    }

    return (
        <div>
            <Form onSubmit={_handleSubmit}>

                <Form.Group className="mb-3" value={newGym.nombreCentro} onChange={(e) => handleChange(e)}>
                    <Form.Label>Nombre Centro</Form.Label>
                    <Form.Control type="string" name="nombreCentro" placeholder="nombreCentro" />
                </Form.Group>

                <Form.Group className="mb-3" value={newGym.password} onChange={handleChange}>
                    <Form.Label> Password </Form.Label>
                    <Form.Control type="string" name="password" placeholder="password" />
                    <Form.Text className="text-muted">
                        We'll never share your password with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" value={newGym.direccion} onChange={handleChange}>
                    <Form.Label> Dirección </Form.Label>
                    <Form.Control type="string" name="direccion" placeholder="direccion" />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3" value={newGym.logo} onChange={handleChange}>
                    <Form.Label> Introduce el logo de tu centro </Form.Label>
                    <Form.Control type="file" name="logo" ref={inputFileRef} />
                </Form.Group>

                <Form.Group className="mb-2" value={newGym.entrenadores} onChange={handleChange}>
                    <Form.Label>"Nombre Entrenador" </Form.Label>
                    <Form.Control type="string" name="entrenadores" placeholder="NombreApellidos" />
                </Form.Group>

                {/* <Form.Group className="mb-2" value={newGym.entrenadores.edad} onChange={handleChange}>
                <Form.Label>"Edad Entrenador" </Form.Label>
                <Form.Control type="number" name="entrenadores.edad" placeholder="Edad" />
            </Form.Group> */}

                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit"> Create! </Button>
            </Form>

        </div>

    )
}

export default FormGym;