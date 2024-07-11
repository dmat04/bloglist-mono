import { Container, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { prettyCount, EmptyState, NotFound } from '../util/common'
import { useGetUsersQuery } from '../reducers/userApi'

const Users = () => {
  const {
    data: users = [],
    isLoading,
    isSuccess,
    isError
  } = useGetUsersQuery()

  if (isError) return <NotFound message='Content not found' />
  if (isLoading) return <div>Loading</div>

  if (isSuccess) {
    return (
      <Container fluid>
        <Row className='mb-4'>
          <Col className='h3 text-muted'>
            Users
          </Col>
        </Row>
        <Row>
          {
            users.length > 0 &&
            <ListGroup>
              {
                users.map((user) =>
                  <LinkContainer key={user.id} to={`/users/${user.id}`}>
                    <ListGroup.Item key={user.id} action className='d-flex justify-content-between align-items-start'>
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold lh-lg fs-5'>
                          {user.name}
                        </div>
                      </div>
                      <Badge pill>
                        {prettyCount(user.blogs.length, 'blog', 'blogs', 'No blogs')}
                      </Badge>
                    </ListGroup.Item>
                  </LinkContainer>
                )
              }
            </ListGroup>
          }
          {
            users.length === 0 &&
            <EmptyState message='No users yet' />
          }
        </Row>
      </Container>
    )
  }
}

export default Users