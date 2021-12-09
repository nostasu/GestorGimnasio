import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card'

const Cards = ({ gimnasio }) => {

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={gimnasio.logo} alt="Logo del Gimnasio" />
            <Card.Body>
                <Card.Title>{gimnasio.nombreCentro}</Card.Title>
                <Link to={`${gimnasio._id}`}>
                    <Button variant="primary">Mas información</Button></Link>
            </Card.Body>
        </Card>
    )
}

export default Cards;