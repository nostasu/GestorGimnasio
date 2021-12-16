import React, { useState } from 'react';
import axios from "axios";
import FormUser from "../components/FormUser";
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const UpdateUser = () => {
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);

    const handleUpdate = async (user) => {

        try {
            setError(null)
            const response = await axios({
                method: 'put',
                url: "/usuarios/",
                headers: {
                    Authorization: localStorage.getItem("jwt_token")
                },
                data: user
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
            <FormUser handleSubmit={handleUpdate} error={error} />
            {exito &&
                <div><Alert> User Updated! </Alert>< Link to={"/MyUser"}><Button variant="primary"> Go Home!</Button></Link> </div>
            }
        </div>
    );
}

export default UpdateUser;