import React, { useState } from 'react';
import axios from "axios";
import FormGym from "../components/FormGym";
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Error from '../components/Error';


const UpdateGym = () => {
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);

    const handleUpdate = async (gimnasio) => {

        try {
            setError(null)
            const formData = new FormData();
            if (gimnasio.nombreCentro) {
                formData.append("nombreCentro", gimnasio.nombreCentro);
            }
            if (gimnasio.password) {
                formData.append("password", gimnasio.password);
            }
            if (gimnasio.direccion) {
                formData.append("direccion", gimnasio.direccion);
            }
            if (gimnasio.logo) {
                formData.append("logo", gimnasio.logo);
            }
            if (gimnasio.entrenadores) {
                gimnasio.entrenadores.forEach((item, i) => {
                    formData.append(`entrenadores[${i}][nombreApellidos]`, item.nombreApellidos);
                    formData.append(`entrenadores[${i}][edad]`, item.edad);
                });
            }

            const response = await axios({
                method: 'put',
                url: "http://localhost:5000/api/gimnasios",

                headers: {
                    Authorization: localStorage.getItem("jwt_token"),
                    "Content-Type": "multipart/form-data"
                },
                data: formData
            })

            console.log(response);
            setExito(response.data.message);

        } catch (err) {
            console.log(err);
            setError(err.response.data);
        };
    }
    return (
        <div>
            <FormGym handleUpdate={handleUpdate} error={error} />
            {exito &&
                <div><Alert> Gym Updated! </Alert>< Link to={"/MyGym"}><Button variant="primary"> Go Home!</Button></Link> </div>
            }
        </div>
    );
}

export default UpdateGym;