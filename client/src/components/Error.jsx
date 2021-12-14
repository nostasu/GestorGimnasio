import React from 'react'
import Alert from 'react-bootstrap/Alert'

const Error = ({ error }) => {
    return (
        <>
            <Alert variant="danger" className="mt-3">
                {error.message}
            </Alert>
        </>
    )
}

export default Error;
