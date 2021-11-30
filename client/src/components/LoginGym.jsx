import React from 'react';
import { Form, FormGroup, FormLabel, FormControl, FormText, FormCheck, Button } from 'react-bootstrap'


const LoginGym = () => {
  return (
    <Form>
      <FormGroup className="mb-3" controlId="formBasicEmail">
        <FormLabel>Email address</FormLabel>
        <FormControl type="email" placeholder="Enter email" />
        <FormText className="text-muted">
          We'll never share your email with anyone else.
        </FormText>
      </FormGroup>

      <FormGroup className="mb-3" controlId="formBasicPassword">
        <FormLabel>Password</FormLabel>
        <FormControl type="password" placeholder="Password" />
      </FormGroup>
      <FormGroup className="mb-3" controlId="formBasicCheckbox">
        <FormCheck type="checkbox" label="Check me out" />
      </FormGroup>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}

export default LoginGym;