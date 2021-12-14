import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Error from '../components/Error';
import Success from '../components/Success';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const JoinClass = () => {

    let { idClase } = useParams();
    const [error, setError] = useState(null);
    const [exito, setExito] = useState(null);

    useEffect(() => {
        const inscribirseClase = async () => {
            try {
                const response = await axios({
                    method: 'put',
                    url: `http://localhost:5000/api/usuarios/inscribirse/${idClase}`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token")
                    }
                });
                console.log(response);
                setExito(response.data);
            } catch (err) {
                setError(err.response.data);
            }
        };
        inscribirseClase();


    }, [idClase]);


    return (
        <div>
            {/* {error ? <Error error={error} /> : <Success mensaje={"Te has inscrito correctamente en la clase"} />} */}
            {error && <Error error={error} />}
            {exito && <Success mensaje={exito} />}

            < Link to={"/MyUser"}><Button variant="primary"> Go Home!</Button></Link>
        </div>
    )
}

export default JoinClass
