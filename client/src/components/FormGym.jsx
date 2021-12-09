import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const FormGym = ({ handleSubmit }) => {
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

        handleSubmit({ ...newGym, logo: inputFileRef.current.files[0] })
    }

    const handleChange = (e) => {
        console.log(e);
        //e tiene la informacion del input que desencadena el change
        setGym({
            ...newGym, //destructuracion formValues
            [e.target.name]: e.target.value,
        })
        console.log(newGym);
    }

    const changeEntrenadores = (e) => {
        setEntrenador({
            ...entrenador,
            [e.target.name]: e.target.value,
        })
    }

    const añadirEntrenador = () => {
        console.log(entrenador);
        setGym({
            ...newGym,
            entrenadores: [...newGym.entrenadores, entrenador]
        });

        setEntrenador("");

        console.log(newGym);
    }


    return (
        <div>
            <Form onSubmit={_handleSubmit}>

                <Form.Group className="mb-3" value={newGym.nombreCentro} onChange={(e) => handleChange(e)}>
                    <Form.Label>Nombre Centro</Form.Label>
                    <Form.Control type="string" name="nombreCentro" placeholder="nombreCentro" />
                </Form.Group>

                <Form.Group className="mb-3" value={newGym.password} onChange={(e) => handleChange(e)}>
                    <Form.Label> Password </Form.Label>
                    <Form.Control type="string" name="password" placeholder="password" />
                    <Form.Text className="text-muted">
                        We'll never share your password with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" value={newGym.direccion} onChange={(e) => handleChange(e)}>
                    <Form.Label> Dirección </Form.Label>
                    <Form.Control type="string" name="direccion" placeholder="direccion" />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3" value={newGym.logo} onChange={(e) => handleChange(e)}>
                    <Form.Label> Introduce el logo de tu centro </Form.Label>
                    <Form.Control type="file" name="logo" ref={inputFileRef} />
                </Form.Group>

                {/* value entrenador */}
                <div className="entrenadores">
                    <Form.Group className="mb-2" value={newGym.entrenadores} onChange={changeEntrenadores}>
                        <Form.Label>Nombre Entrenador</Form.Label>
                        <Form.Control type="string" name="nombreApellidos" placeholder="NombreApellidos" />
                    </Form.Group>

                    <Form.Group className="mb-2" value={newGym.entrenadores} onChange={changeEntrenadores}>
                        <Form.Label>Edad Entrenador</Form.Label>
                        <Form.Control type="string" name="edad" placeholder="Edad" />
                    </Form.Group>

                    <button type="button" className="btn btn-light" onClick={añadirEntrenador}>Añadir Entrenador</button>

                    {newGym.entrenadores.map(entrenador => {
                        return (
                            `Añadido: ${entrenador.nombreApellidos}, ${entrenador.edad}`
                        )
                    })
                    }
                    <Button variant="primary" type="submit"> Create! </Button>
                </div>

            </Form>

        </div>

    )
}

export default FormGym;