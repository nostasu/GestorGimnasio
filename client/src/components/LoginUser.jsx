import axios from 'axios';
import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, FormText, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import Error from "./Error";

const LoginUser = () => {

    let navigate = useNavigate();
    let [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const _handleSubmit = (e) => {
        e.preventDefault();
        submit()
    }

    const submit = async () => {
        try {
            const response = await axios.post("/api/authUser/login", user);
            console.log(response.data);
            localStorage.setItem("jwt_token", response.data.token);
            navigate('/MyUser');
        } catch (err) {
            setError(err.response.data);
        }
    }

    return (
        <>
            <div className="container mt-3">
                <Form onSubmit={_handleSubmit}>
                    <FormGroup className="mb-3" controlId="formBasicEmail">
                        <FormLabel className="mb-0">Email</FormLabel>
                        <FormControl type="email" placeholder="Email" name="email" onChange={e => handleChange(e)} />
                    </FormGroup>

                    <FormGroup className="mb-3" controlId="formBasicPassword">
                        <FormLabel className="mb-0">Password</FormLabel>
                        <FormControl type="password" placeholder="Password" name="password" onChange={e => handleChange(e)} />
                        <FormText className="text-muted">
                            We'll never share your email with anyone else.
                        </FormText>
                    </FormGroup>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
            {error && <Error error={error} />}
        </>
    )
}

export default LoginUser;