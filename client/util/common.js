import { Alert } from 'react-bootstrap'

export const prettyCount = (count, labelSingular, labelPlural, labelNone) => {
  return count > 0
    ? count === 1 ? `1 ${labelSingular}` : `${count} ${labelPlural}`
    : labelNone
}

export const EmptyState = ({ message }) => {
  return (
    <Alert
      variant="secondary"
      className='d-flex justify-content-center'
    >
      {message}
    </Alert>
  )
}

export const NotFound = ({ message }) => {
  return (
    <Alert variant="warning">
      <Alert.Heading>
        Error 404
      </Alert.Heading>
      <p>
        {message}
      </p>
    </Alert>
  )
}


// Everything from application wide common items is available through here
export * from '@root/config/common'
