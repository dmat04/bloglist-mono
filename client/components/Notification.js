import React from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer, Toast } from 'react-bootstrap'

const Notification = () => {
  const { message, isError } = useSelector((state) => state.notification)

  if (!message) {
    return null
  }

  const variant = isError ? 'danger' : 'success'
  const title = isError ? 'Error' : 'Success'

  return (
    <ToastContainer
      className="p-3 error"
      position="bottom-center"
      style={{ zIndex: 1 }}
    >
      <Toast
        className="d-inline-block m-1"
        bg={variant}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default Notification
