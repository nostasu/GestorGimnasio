import React, { useState } from 'react'
import axios from "axios";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';

const Mostrar1Gym = () => {

    let { GymId } = useParams();

    const [gym, setGym] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios(`http://localhost:5000/api/gimnasios/find/${GymId}`);
                console.log(response.data);
                setGym(response.data.gym);
            } catch (err) {
                console.log(err.response);
            }
        }
        getData()
    }, [GymId])
    return (
        <div>
            {gym ? gym.nombreCentro : "loading.."}
        </div >
    )
}

export default Mostrar1Gym
