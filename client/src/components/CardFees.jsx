import React from 'react'
import Card from 'react-bootstrap/Card'


const CardFees = ({ cuota }) => {
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{cuota.nombre}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Precio: {cuota.precio}</Card.Subtitle>
                    <Card.Text>
                        Numero de clases disponibles: {cuota.clases}
                    </Card.Text>

                </Card.Body>
            </Card>
        </div>
    )
}

export default CardFees
