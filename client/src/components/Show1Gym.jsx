import React, { useState } from 'react'
import axios from "axios";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';

const Show1Gym = () => {

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

    const mostrarCentros = () => {
        return (
            <div className="containerPpal mt-3">
                Página en proceso de creación, mostrará el mapa, entrenadores, y cuotas del gym
                <h1 className="mt-3"> {gym.nombreCentro}</h1>
            </div>
        )
    }
    return (
        <div>
            {gym ? mostrarCentros() : "loading.."}
        </div >
    )
}

export default Show1Gym
