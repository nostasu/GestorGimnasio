import { useEffect, useState } from "react";
import axios from "axios";
import Cards from "./Cards"
import { Form, Col } from "react-bootstrap";


const ShowGyms = (props) => {
    const [gyms, setGyms] = useState([]);


    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios("http://localhost:5000/api/gimnasios/allGyms");
                setGyms(response.data.gyms);

            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    //Pruebas para renderizado condicional, si el prop viene de signupuser, mostrar solo los nombres


    const showCards = () => {
        return (
            <>
                {gyms.map((gimnasio, i) => {
                    return (
                        < Cards key={i} gimnasio={gimnasio} />
                    );
                })}
            </>
        )
    }

    const handleChange = (e) => {
        //e tiene la informacion del input que desencadena el change
        console.log(e);
        props.setGym(e.target.value);
        console.log(props.gym);
    }

    const showNameGyms = () => {
        return (
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label className="mb-0">Gimnasio</Form.Label>
                <Form.Select onChange={(e) => handleChange(e)}>
                    <option>Escoge gimnasio!</option>

                    {gyms.map((gimnasio) => {
                        return (
                            <option key={gimnasio._id} name="gimnasio" value={gimnasio._id}>{gimnasio.nombreCentro} </option>
                        );
                    })}
                </Form.Select>
            </Form.Group>
        )
    }

    return (
        <div>
            {props.comesFrom ? showNameGyms() : showCards()}
        </div>
    )
}

export default ShowGyms;