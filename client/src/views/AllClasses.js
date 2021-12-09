
import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import CardClasses from "../components/CardClasses"
import { useParams } from 'react-router';

const AllClasses = () => {
    const [clases, setClases] = useState([]);
    let { id } = useParams();

    //necesito la id del gym. Si viene de usuario, la tendra como usuario.id, si viene de gym---> ._id

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

    //si vengo de usuarios, me va a mostrar las clases y un link que me lleve a esa clase
    // y me permita apuntarme



    const showClassesGym = () => {
        let arrayGym = clases.filter(clase => clase.gimnasio === id);

        return (
            <div className="d-flex flex-row justify-content-around">
                {arrayGym.map((clase) => {
                    return (
                        <CardClasses key={clase._id} clase={clase} />
                    );
                })}
            </div>
        )
    }

    return (
        <div>
            {showClassesGym()}

        </div>
    )
}

export default AllClasses;