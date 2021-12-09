import React from 'react'
import axios from "axios";
import FormClass from '../components/FormClass'
import { useNavigate } from 'react-router-dom';


const CreateClass = () => {
    let navigate = useNavigate();
    const handleSubmit = async (clase) => {
        console.log(clase);
        try {
            const response = await axios({
                method: 'post',
                url: "http://localhost:5000/api/clases",
                headers: {
                    Authorization: localStorage.getItem("jwt_token"),
                },
                data: clase
            })

            console.log(response);
            navigate("/MyGym");

        } catch (err) {
            console.log(err.response);
        };
    }
    return (
        <div>
            <FormClass handleSubmit={handleSubmit} />
        </div>
    )
}


export default CreateClass;
