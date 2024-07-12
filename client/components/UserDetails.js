import React from 'react'
import {
  Container, ListGroup, Badge, Row, Col,
} from 'react-bootstrap'
import { useMatch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { EmptyState, NotFound } from '../util/common'
import { useGetUsersQuery } from '../reducers/userApi'

const UserDetails = () => {
  const match = useMatch('/users/:id')

  const {
    user,
    isLoading,
    isSuccess,
    isError,
  } = useGetUsersQuery(undefined, {
    selectFromResult: (result) => ({
      user: result.data?.find((u) => u.id === match.params.id),
      isLoading: result.isLoading,
      isSuccess: result.isSuccess,
      isError: result.isError,
    }),
  })

  if (isError || (isSuccess && !user)) return <NotFound message="User not found" />
  if (isLoading) return <div>Loading</div>
  if (isSuccess && user) {
    return (
      <Container fluid>
        <Row className="mb-4">
          <Col className="h3 text-muted">
            Blogs by
            {' '}
            <strong>{user.name}</strong>
          </Col>
        </Row>
        <Row>
          {
            user.blogs.length > 0
            && (
            <ListGroup>
              {
                user.blogs
                  .map((blog) => (
                    <LinkContainer key={blog.id} to={`/blogs/${blog.id}`}>
                      <ListGroup.Item key={blog.id} action className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold lh-lg fs-5">
                            {blog.title}
                          </div>
                        </div>
                        <Badge pill>
                          {blog.likes}
                        </Badge>
                      </ListGroup.Item>
                    </LinkContainer>
                  ))
              }
            </ListGroup>
            )
          }
          {
            !user.blogs.length
            && <EmptyState message="User hasn&apos;t submitted any blogs" />
          }
        </Row>
      </Container>
    )
  }

  return null
}

export default UserDetails
