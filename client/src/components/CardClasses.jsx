import React from 'react'
import { Card } from 'react-bootstrap'

const CardClasses = ({ clase }) => {

    const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const d = new Date(clase.fechaHora);
    let mes = month[d.getMonth()];
    let day = d.getDate();
    let hour = `${d.getHours() - 1}:00`;

    return (

        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <span> {day} </span>
                <span> {mes}</span>
            </Card.Body>
            <Card.Body>
                <Card.Title>{clase.tipoClase}</Card.Title>
                <Card.Text>
                    {hour}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CardClasses
