import React, { useState } from 'react'
import axios from "axios";
import FormClass from '../components/FormClass'
import { useNavigate } from 'react-router-dom';
import Error from '../components/Error';

const CreateClass = () => {

    let navigate = useNavigate();
    const [error, setError] = useState(null);
    const handleSubmit = async (clase) => {
        console.log(clase);
        try {
            const response = await axios({
                method: 'post',
                url: "/clases",
                headers: {
                    Authorization: localStorage.getItem("jwt_token"),
                },
                data: clase
            })

            console.log(response);
            navigate("/MyGym");

        } catch (err) {
            console.log(err.response);
            setError(err.response.data);
        };
    }
    return (
        <div>
            <FormClass handleSubmit={handleSubmit} />
            {error && <Error error={error} />}
        </div>
    )
}


export default CreateClass;
