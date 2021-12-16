import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "./stylesComponents/cards.css"

const CardClasses = (props) => {

    let { idUser } = useParams();
    const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const d = new Date(props.clase.fechaHora);
    let mes = month[d.getMonth()];
    let day = d.getDate();
    let minutes = (d.getMinutes() < 10 ? `0${d.getMinutes()}` : '')
    let hour = `${d.getHours() - 1}:${minutes}`;

    const pintaBorrar = () => {
        if (props.from === "gimnasio") {
            return (<Link to={`/BorrarClaseGym/${props.clase._id}`}><i className="bi bi-trash d-flex" /></Link>)
        }
    }

    const pintaEditar = () => {
        let apuntarse = true;
        if (props.from === "usuario") {
            props.clase.alumnosInscritos.forEach(alumno => {
                if (alumno._id === idUser) {
                    apuntarse = false;
                }
            })
            if (apuntarse === false) {
                return (<Card.Body><Link to={`/BorrarClase/${props.clase._id}`}><i className="bi bi-trash"></i></Link></Card.Body>)
            }
            return (
                <>
                    <Card.Body><Link to={`/ApuntarseClase/${props.clase._id}`}><i class="bi bi-check2-square"></i></Link></Card.Body>
                </>
            )
        }
    }

    return (
        <Card className="cardClasses mt-3">
            <Card.Body className="fechaHora">
                {day} <br />
                {mes} <br />
                {hour}
            </Card.Body >
            <Card.Body className="tipoClase">
                <Card.Title>{props.clase.tipoClase}</Card.Title>
            </Card.Body>
            <div className="borraEdita me-2">
                {pintaBorrar()}
                {pintaEditar()}
            </div>
        </Card >
    )
}

export default CardClasses
