import Button from 'react-bootstrap/Button';
import { Card, CardBody, CardTitle, CardImg } from 'reactstrap';

const Cards = ({ gimnasio }) => {
    return (

        <Card>
            <CardImg src={gimnasio.logo} alt="Logo del Gimnasio" />
            <CardBody>
                <CardTitle>{gimnasio.nombreCentro}</CardTitle>
                <Button variant="primary">Mas información</Button>
            </CardBody>
        </Card>




    )
}

export default Cards;