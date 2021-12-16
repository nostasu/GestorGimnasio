import { useEffect, useState } from "react";
import axios from "axios";
import Error from "../components/Error";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button"
import Success from "../components/Success";


const DeleteTraining = () => {

    let { claseId } = useParams();
    const [error, setError] = useState();
    let [borrada, setBorrada] = useState();

    useEffect(() => {
        const eliminarReserva = async () => {
            try {
                const response = await axios({
                    method: 'put',
                    url: `/api/usuarios/delete/clase/${claseId}`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token"),
                    },
                })
                setBorrada(response.data);
            } catch (err) {
                setError(err.response.data);
            }
        };
        eliminarReserva();
    }, [claseId]);


    return (
        <div>
            {error && <Error error={error} />}
            {borrada && <Success mensaje={borrada} />}
            < Link to={"/MyUser"}><Button variant="primary"> Go Home!</Button></Link>

        </div >
    )
}

export default DeleteTraining;