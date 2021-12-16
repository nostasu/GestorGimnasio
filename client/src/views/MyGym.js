import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavbarPpal from '../components/NavbarPpal';


const MyGym = () => {

    const [gym, setGym] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios({
                    url: `/gimnasios/myGym`,
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
            <div className="containerPpal myUser">
                <div className="d-flex justify-content-around">
                    <img src={gym.logo} width="200" alt="logo del gimnasio" />
                    <div className="d-flex flex-column align-items-start">
                        <Link to="/ActualizarGimnasio" className="mb-3"><i className="bi bi-pen-fill"> Editar </i></Link>
                        <Link to="/BorrarUsuario" state={{ from: 'gimnasio' }}><i className="me-3 bi bi-trash"> Borrar</i></Link>
                    </div>
                </div>
                <div className="presentacionCentro mt-3">
                    <h2> Bienvenido {gym.nombreCentro}!</h2>
                    <p> Aquí puedes añadir clases, mostrar todas clases, crear tus cuotas y mostrarlas todas</p>
                </div>
                <hr />
                <div className="container">
                    <Link to="/CrearClase"> Crear Clases!</Link><hr />
                    <Link to={`/TodasClases/${gym._id}/*`} state={{ from: 'gimnasio' }}> Mostrar Clases y Eliminarlas </Link> <hr />
                    <Link to="/CrearCuota">Crear Cuotas!</Link><hr />
                    <Link to={`/MostrarCuotas/${gym._id}`} state={{ from: 'gimnasio' }} > Mostrar Todas Cuotas </Link><hr />
                </div>

            </div >

        )
    }

    //Lo primero, obtener la id del gym
    return (
        <>
            {gym ? pintarPantalla() : loading()}
            <NavbarPpal gym={"gym"} />
        </>
    )
}

export default MyGym
