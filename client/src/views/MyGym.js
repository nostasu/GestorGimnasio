import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyGym = () => {

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
    }, [])

    const loading = () => {
        return ("Loading..");
    }

    const pintarPantalla = () => {
        return (
            <div>
                <p> Probando redirigir gym</p>
                <p> Aqui tenemos que tener, header ( por defecto) , pagina, footer</p>
                <div className="container containerUp">
                    <p> Logo (que lo tengo) </p>
                    <p> Nombre</p>
                    <p> Email </p>
                    <p> Emoticono Borrar </p>
                    <p> Emoticono Boli</p>

                </div>

                <div className="container">
                    <p> <Link to="/CrearClase"> Crear Clases!</Link></p>
                    <p> <Link to={`/TodasClases/${gym._id}`}> Mostrar Clases y Eliminarlas </Link></p>
                    <p> <Link to="/CrearCuota">Crearr Cuotas!</Link></p>
                    <p> <Link to="/MostrarTodasCuotas" >Mostrar todas Cuotas </Link> </p>

                </div>
            </div>
        )
    }

    //Lo primero, obtener la id del gym
    return (
        <>
            {gym ? pintarPantalla() : loading()}
        </>
    )
}

export default MyGym
