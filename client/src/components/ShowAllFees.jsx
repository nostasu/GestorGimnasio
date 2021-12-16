import { useEffect, useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

const ShowAllFees = (props) => {
    const [fees, setFees] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios("/api/cuotas");
                setFees(response.data.fees);

            } catch (err) {
                console.log(err.response);
            }
        };
        getData();
    }, []);

    const [gym, setGym] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios({
                    url: `/api/gimnasios/find/${props.gym}`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token")
                    }
                });
                setGym(response.data.gym);
            } catch (err) {
                console.log(err.response);
            }
        }
        getData()
    }, [props])

    const cuotasDelGym = () => {

        let arrayFiltrado = fees.filter(cuota => gym.cuotas.includes(cuota._id));

        return (
            <Form.Group controlId="formGridState" className="col-md-3">
                <Form.Label className="mb-0 mt-3">Cuotas</Form.Label>
                <Form.Select onChange={(e) => handleChange(e)}>
                    <option>Escoge una Cuota!</option>

                    {arrayFiltrado.map((cuota, i) => {
                        return (
                            <option key={i} name="cuota" value={cuota._id}>{cuota.nombre}</option>
                        );
                    })}
                </Form.Select>
            </Form.Group>
        )
    }

    const handleChange = (e) => {
        //e tiene la informacion del input que desencadena el change
        props.setFee(e.target.value);
    }

    return (
        <>
            {gym && cuotasDelGym()}
        </>
    )
}

export default ShowAllFees;