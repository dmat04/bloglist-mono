import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { useDoLoginMutation } from '../reducers/baseApi'
import authSlice from '../reducers/authSlice'

const LoginForm = ({ notifyOnSubmit }) => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useDoLoginMutation()

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const result = await login({ username, password })
      if (result.data) {
        dispatch(authSlice.actions.setUser(result.data))
      }
    } catch (ex) {
      console.log(ex)
    } finally {
      notifyOnSubmit()
    }
  }

  return (
    <Form className="d-flex" onSubmit={onSubmit}>
      <Form.Control
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="me-2"
        aria-label="Username"
      />
      <Form.Control
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="me-2"
        aria-label="Password"
      />
      <Button variant="outline-success" type='submit'>Login</Button>
    </Form>
  )
}

export default LoginForm
