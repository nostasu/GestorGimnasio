import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import FormUser from "../components/FormUser";

const SignUpUser = () => {
    let navigate = useNavigate();
    const [error, setError] = useState(null);
    const handleSubmit = async (user) => {
        try {
            const response = await axios({
                method: 'post',
                url: "/api/authUser/signup",
                data: user
            })

            console.log(response);
            navigate("/LoginUser");

        } catch (err) {
            console.log(err);
            setError(err.response.data);
        };
    }
    return (
        <div>
            <FormUser handleSubmit={handleSubmit} error={error} />
        </div>
    );
}

export default SignUpUser;