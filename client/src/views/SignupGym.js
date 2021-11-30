import React, { Fragment } from 'react'; //Es como un div

import FormGym from "../components/FormGym";
import CreateGym from "../components/CreateGym"

const SignUpGym = () => {

    const handleSubmit = (data) => {
        CreateGym(data);
    }

    return (
        <Fragment>
            <h1>Formulario</h1>
            <FormGym handleSubmit={handleSubmit} />
        </Fragment>
    );
}

export default SignUpGym;