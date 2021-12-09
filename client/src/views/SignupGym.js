import React from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import FormGym from "../components/FormGym";


const SignUpGym = () => {

    let navigate = useNavigate();

    const handleSubmit = async (gimnasio) => {
        try {

            const formData = new FormData();

            formData.append("nombreCentro", gimnasio.nombreCentro);
            formData.append("password", gimnasio.password);
            formData.append("direccion", gimnasio.direccion);
            formData.append("logo", gimnasio.logo);
            console.log(gimnasio.entrenadores);
            gimnasio.entrenadores.forEach((item, i) => {
                formData.append(`entrenadores[${i}][nombreApellidos]`, item.nombreApellidos);
                formData.append(`entrenadores[${i}][edad]`, item.edad);
            });

            const response = await axios({
                method: 'post',
                url: "http://localhost:5000/api/authGym/signup",
                headers: { "Content-Type": "multipart/form-data" },
                data: formData
            })

            console.log(response);
            navigate("/LoginGym")

        } catch (err) {
            console.log(err.response);
        }
    }

    return (
        <>
            <FormGym handleSubmit={handleSubmit} />
        </>
    );
}

export default SignUpGym;