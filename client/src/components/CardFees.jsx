import React from 'react'
import Card from 'react-bootstrap/Card'


const CardFees = ({ cuota }) => {
    return (
        <div>
            <Card style={{ width: '18rem' }} className="mt-3 ms-3">
                <Card.Body>
                    <Card.Title>{cuota.nombre}</Card.Title>
                    <Card.Subtitle>Precio: {cuota.precio}</Card.Subtitle>
                    <Card.Text>
                        Clases: {cuota.clases}
                    </Card.Text>

                </Card.Body>
            </Card>
        </div>
    )
}

export default CardFees
