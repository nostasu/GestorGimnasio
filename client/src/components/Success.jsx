import React from 'react'
import Alert from 'react-bootstrap/Alert'

const Success = ({ mensaje }) => {
    return (
        <>
            <Alert variant="primary" className="mt-3">
                {mensaje.message}
            </Alert>
        </>
    )
}

export default Success;
