import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Col } from "react-bootstrap";
import CardFees from "./CardFees";

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


    const handleChange = (e) => {
        //e tiene la informacion del input que desencadena el change
        props.setFee(e.target.value);
        console.log(props.fee);
    }

    const showFees = () => {
        return (
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Cuotas</Form.Label>
                <Form.Select onChange={(e) => handleChange(e)}>
                    <option>Escoge una Cuota!</option>

                    {fees.map((cuota, i) => {
                        return (
                            <option key={i} name="cuota" value={cuota._id}>{cuota.nombre}</option>
                        );
                    })}
                </Form.Select>
            </Form.Group>
        )
    }

    const showAll = () => {
        return (
            <>
                {fees.map((cuota, i) => {
                    return (
                        < CardFees key={i} cuota={cuota} />
                    );
                })}
            </>
        )
    }

    return (
        <div>
            {console.log(props)}

            {props.comesFrom ? showAll() : showFees()}
        </div>
    )
}

export default ShowAllFees;