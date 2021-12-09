import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import FormUser from "../components/FormUser";



const SignUpUser = () => {
    let navigate = useNavigate();
    const handleSubmit = async (user) => {
        try {
            const response = await axios({
                method: 'post',
                url: "http://localhost:5000/api/authUser/signup",
                data: user
            })

            console.log(response);
            navigate("/MyUser")

        } catch (err) {
            console.log(err.response);
        };
    }
    return (
        <>
            <FormUser handleSubmit={handleSubmit} />
        </>
    );
}

export default SignUpUser;