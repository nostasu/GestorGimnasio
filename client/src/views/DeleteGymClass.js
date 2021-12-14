import { useEffect, useState } from "react";
import axios from "axios";
import Error from "../components/Error";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button"
import Success from "../components/Success";


const DeleteGymClass = () => {

    let { claseId } = useParams();
    const [error, setError] = useState();
    let [borrada, setBorrada] = useState();

    useEffect(() => {
        const eliminarClase = async () => {
            try {
                const response = await axios({
                    method: 'delete',
                    url: `http://localhost:5000/api/clases/delete/${claseId}`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token"),
                    },
                })
                setBorrada(response.data);
            } catch (err) {
                setError(err.response.data);
            }
        };
        eliminarClase();
    }, [claseId]);


    return (
        <div>
            {error && <Error error={error} />}
            {borrada && <Success mensaje={borrada} />}
            < Link to={"/MyGym"}><Button variant="primary"> Go Home!</Button></Link>

        </div >
    )
}

export default DeleteGymClass;