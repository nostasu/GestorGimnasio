import axios from 'axios';
import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormControl, FormText, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import Error from "./Error";

const LoginGym = () => {

  let navigate = useNavigate();
  let [gym, setGym] = useState({
    nombreCentro: "",
    password: ""

  });

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setGym({
      ...gym,
      [e.target.name]: e.target.value
    })
  }

  const _handleSubmit = (e) => {
    e.preventDefault();
    submit()
  }

  const submit = async () => {

    try {
      const response = await axios.post("http://localhost:5000/api/authGym/login", gym);
      console.log(response.data);
      localStorage.setItem("jwt_token", response.data.token);
      navigate('/MyGym');

    } catch (err) {
      console.log(err.response);
      setError(err.response.data);
    }

  }
  return (
    <>
      <Form onSubmit={_handleSubmit}>
        <FormGroup className="mb-3" controlId="formBasic">
          <FormLabel>Nombre Centro</FormLabel>
          <FormControl type="string" placeholder="Nombre del centro" name="nombreCentro" onChange={e => handleChange(e)} />
        </FormGroup>

        <FormGroup className="mb-3" controlId="formBasicPassword">
          <FormLabel>Password</FormLabel>
          <FormControl type="password" placeholder="Password" name="password" onChange={e => handleChange(e)} />
          <FormText className="text-muted">
            We'll never share your email with anyone else.
          </FormText>
        </FormGroup>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <div >
        {error && <Error error={error} />}
      </div>
    </>
  )
}

export default LoginGym;