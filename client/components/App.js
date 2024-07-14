import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap/'
import authSlice from '../reducers/authSlice'
import Notification from './Notification'
import LoginForm from './LoginForm'
import Blogs from './Blogs'
import Users from './Users'
import UserDetails from './UserDetails'
import BlogDetails from './BlogDetails'
import Header from './Header'
import { NotFound } from '../util/common'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authSlice.actions.getFromLocalStorage())
  }, [dispatch])

  return (
    <>
      <Container fluid>
        <Row className="mb-2">
          <Col>
            <Header />
          </Col>
        </Row>
        <Row>
          <Col>
            <Routes>
              <Route path="/" element={<Navigate replace to="/blogs" />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="*" element={<NotFound message="Resource not found" />} />
            </Routes>
          </Col>
        </Row>
      </Container>

      <Notification />
    </>
  )
}

export default App
