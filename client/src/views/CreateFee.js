import React from 'react'
import axios from 'axios';
import FormCuota from '../components/FormCuota'
import { useNavigate } from 'react-router-dom';


const CreateFee = () => {
    let navigate = useNavigate();

    const handleSubmit = async (fee) => {
        try {

            const params = new URLSearchParams();
            params.append('nombre', fee.nombre);
            params.append('precio', fee.precio);
            params.append('clases', fee.clases);

            const response = await axios({
                method: 'post',
                url: "http://localhost:5000/api/cuotas",
                headers: {
                    Authorization: localStorage.getItem("jwt_token"),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: params.toString()
            })
            console.log(response);
            navigate("/MyGym");

        } catch (err) {
            console.log(err.response);
        };

    }

    return (
        <div>
            <FormCuota handleSubmit={handleSubmit} />
        </div>
    )
}


export default CreateFee;
