
import React, { useEffect, useState } from 'react'

import axios from "axios";
import CardClasses from "../components/CardClasses"
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom'
import { Alert } from 'react-bootstrap';

const AllClasses = () => {

    const [clases, setClases] = useState([]);
    let { id } = useParams();
    const location = useLocation()
    const { from } = location.state;

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios({
                    url: "http://localhost:5000/api/clases",
                });
                setClases(response.data.classes);

            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    const showClassesGym = () => {
        let arrayGym = clases.filter(clase => clase.gimnasio === id);
        var sortedArray = arrayGym.sort((a, b) => {
            return new Date(a.fechaHora).getTime() -
                new Date(b.fechaHora).getTime()
        });

        if (sortedArray.length === 0) {
            return (
                <Alert variant="danger" className="mt-3">
                    Todavia no existen clases!</Alert>
            )
        }


        return (
            <div className="d-flex flex-row flex-wrap justify-content-around">
                {sortedArray.map((clase) => {
                    return (
                        <div key={clase._id}>
                            <CardClasses clase={clase} from={from}> </CardClasses>
                        </div>
                    );
                })}
            </div>
        )
    }

    return (
        <div>
            {clases && showClassesGym()}
        </div>
    )
}

export default AllClasses;