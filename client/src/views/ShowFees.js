import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap';
import CardFees from "../components/CardFees"
import Error from '../components/Error';

const ShowFees = () => {

    const [fees, setFees] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        const getFees = async () => {
            try {
                const response = await axios({
                    url: "http://localhost:5000/api/cuotas",
                });
                console.log(response.data);
                setFees(response.data.fees);

            } catch (err) {
                setError(err.response.data)
            }
        };
        getFees();
    }, []);

    const [gym, setGym] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios({
                    url: `http://localhost:5000/api/gimnasios/myGym`,
                    headers: {
                        Authorization: localStorage.getItem("jwt_token")
                    }
                });
                console.log(response.data);
                setGym(response.data.gym); //ya tengo todo en gym
            } catch (err) {
                console.log(err.response);
            }
        }
        getData()
    }, [fees])

    const cuotasDelGym = () => {
        //Tendre dos arrays, el de las cuotas, y el del gym
        let arrayFiltrado = fees.filter(cuota => gym.cuotas.includes(cuota._id));

        if (arrayFiltrado.length === 0) {
            return (
                <Alert variant="danger" className="mt-3">
                    Todavia no existen clases!</Alert>
            )
        }
        return (
            arrayFiltrado.map((cuota, i) => {
                return (
                    < CardFees key={i} cuota={cuota} />
                );
            })
        )
    }



    //Aqui tengo el array de cuotas, y tengo el gym por params
    return (
        <div>
            {error && <Error error={error} />}
            {gym && cuotasDelGym()}
        </div>
    )

}

export default ShowFees
