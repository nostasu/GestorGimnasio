import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Error from "../components/Error";
import Button from "react-bootstrap/Button"


const BorrarUsuario = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const borrarUsuario = async () => {
            try {
                const response = await axios({
                    method: 'delete',
                    url: "/usuarios/",
                    headers: {
                        Authorization: localStorage.getItem("jwt_token"),
                    },
                })
                console.log(response.data);


            } catch (err) {
                setError(err.response.data);
            }
        }
        borrarUsuario();
    }, [])

    return (
        <>
            {error ? <Error error={error} /> : <div className="alert alert-primary mt-3" role="alert">
                Usuario borrado correctamente, esperamos que vuelvas a hacer deporte con nosotros!
            </div>}
            <Link to={"/"}>
                <Button variant="primary"> Go Home! </Button>
            </Link>

        </>
    )

}
export default BorrarUsuario;