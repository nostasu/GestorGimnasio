import React from 'react'
import Alert from 'react-bootstrap/Alert'

const Error = ({ error }) => {
    return (
        <>
            <Alert variant="danger">
                {error.message}
            </Alert>
        </>
    )
}

export default Error;
