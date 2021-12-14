import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Col } from "react-bootstrap";

const ShowAllFees = (props) => {
    const [fees, setFees] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios("http://localhost:5000/api/cuotas");
                console.log(response.data);
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
                    url: `http://localhost:5000/api/gimnasios/find/${props.gym}`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token")
                    }
                });
                console.log(response.data);
                setGym(response.data.gym);
            } catch (err) {
                console.log(err.response);
            }
        }
        getData()
    }, [props])

    const cuotasDelGym = () => {

        let arrayFiltrado = fees.filter(cuota => gym.cuotas.includes(cuota._id));


        console.log(arrayFiltrado);
        return (
            <Form.Group as={Col} controlId="formGridState">
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
        console.log(props.fee);
    }

    return (
        <div>

            {gym && cuotasDelGym()}
        </div>
    )
}

export default ShowAllFees;