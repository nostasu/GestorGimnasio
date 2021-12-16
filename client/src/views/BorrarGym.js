import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Error from "../components/Error";
import Button from "react-bootstrap/Button"


const BorrarGym = () => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const borrarGym = async () => {
            try {
                const response = await axios({
                    method: 'delete',
                    url: "/api/gimnasios/",
                    headers: {
                        Authorization: localStorage.getItem("jwt_token"),
                    },
                })
                console.log(response.data);


            } catch (err) {
                setError(err.response.data);
            }
        }
        borrarGym();
    }, [])

    return (
        <>
            {error ? <Error error={error} /> : <div className="alert alert-primary mt-3" role="alert">
                Gimnasio borrado correctamente, esperamos que vuelvas a usar nuestra aplicación pronto!
            </div>}
            <Link to={"/"}>
                <Button variant="primary"> Go Home! </Button>
            </Link>

        </>
    )

}
export default BorrarGym;