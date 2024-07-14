import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import React, { useRef } from 'react'
import {
  Container, Offcanvas, Navbar, Nav, Button,
} from 'react-bootstrap'
import authSlice from '../reducers/authSlice'
import LoginForm from './LoginForm'

const Header = () => {
  const user = useSelector((state) => state.auth)
  const offcanvasRef = useRef()
  const dispatch = useDispatch()

  const closeOffcanvas = () => offcanvasRef.current.backdrop?.click()

  const handleLogout = () => {
    dispatch(authSlice.actions.clearUser())
    closeOffcanvas()
  }

  return (
    <Navbar expand="md" className="bg-body-tertiary mb-3" collapseOnSelect>
      <Container fluid>
        <Navbar.Toggle aria-controls="offcanvas" />
        <LinkContainer to="/blogs">
          <Navbar.Brand>Bloglist</Navbar.Brand>
        </LinkContainer>
        <Navbar.Offcanvas
          id="offcanvas"
          ref={offcanvasRef}
          aria-labelledby="offcancasLabel"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcancasLabel">
              Bloglist
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
              <LinkContainer to="/blogs">
                <Nav.Link>Blogs</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/users">
                <Nav.Link>Users</Nav.Link>
              </LinkContainer>
            </Nav>
            {
              user.name
              && (
              <>
                <Navbar.Text>
                  Signed in as:
                  {' '}
                  {user.name}
                </Navbar.Text>
                <Button
                  className="ms-2"
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
              )
            }
            {
              !user.name
              && <LoginForm notifyOnSubmit={closeOffcanvas} />
            }
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default Header
