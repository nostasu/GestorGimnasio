import { useEffect, useState } from "react";
import axios from "axios";
import Cards from "./Cards"
import { Form } from "react-bootstrap";
import "../components/stylesComponents/cards.css"

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

    //Para la pagina de nuestros centros, nos muestra cards con los gyms
    const showCards = () => {
        return (
            <div className="mostrarTodosGym d-flex flex-column justify-content-center mb-2" >
                <div className="row justify-content-center mt-3">
                    {gyms.map((gimnasio, i) => {
                        return (
                            < Cards key={i} gimnasio={gimnasio} />
                        );
                    })
                    }
                </div>
            </div >
        )
    }

    const handleChange = (e) => {
        props.setGym(e.target.value);
    }

    //Para mostrar en el signin de usuario
    const showNameGyms = () => {
        return (
            <Form.Group controlId="formGridState" className="col-md-3">
                <Form.Label className="mb-0"> Gimnasio</Form.Label >
                <Form.Select onChange={(e) => handleChange(e)}>
                    <option>Escoge gimnasio!</option>

                    {gyms.map((gimnasio) => {
                        return (
                            <option key={gimnasio._id} name="gimnasio" value={gimnasio._id}>{gimnasio.nombreCentro} </option>
                        );
                    })}
                </Form.Select>
            </Form.Group >
        )
    }

    return (
        <>
            {props.comesFrom ? showNameGyms() : showCards()}
        </>
    )
}

export default ShowGyms;