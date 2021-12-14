import React from 'react'
import Card from 'react-bootstrap/Card'
import "./stylesComponents/cards.css"

const CardFees = ({ cuota }) => {
    return (
        <Card className="mt-3 ms-1 col-md-3">
            <Card.Body>
                <Card.Title>{cuota.nombre}</Card.Title>
                <hr />
                <Card.Subtitle>Precio: {cuota.precio}</Card.Subtitle>
                <Card.Text>
                    Clases: {cuota.clases}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CardFees
