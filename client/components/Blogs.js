import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Badge, ListGroup, Container, Row, Col, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import BlogForm from './BlogForm'
import { EmptyState, NotFound, prettyCount } from '../util/common'
import { useGetBlogsQuery } from '../reducers/blogApi'

const Blogs = () => {
  const {
    data: blogs = [],
    isLoading,
    isSuccess,
    isError
  } = useGetBlogsQuery(undefined)

  const sortedBlogs = useMemo(() => {
    const sortedBlogs = blogs.slice()
    sortedBlogs.sort((a, b) => b.likes - a.likes)
    return sortedBlogs
  }, [blogs])

  const auth = useSelector((state) => state.auth)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  const toggleBlogForm = () => {
    setBlogFormVisible(!blogFormVisible)
  }

  if (isSuccess && blogs.length === 0) return <EmptyState message='No blogs yet' />
  if (isLoading) return <div>Loading</div>
  if (isError) return <NotFound message='An error occured while fetching blogs' />

  return (
    <Container fluid>
      <Row className='mb-4'>
        <Col className='h3 text-muted'>
          Blogs
        </Col>
      </Row>
      <Row className={(auth.username && blogFormVisible) ? '' : 'd-none'}>
        <Col>
          <BlogForm />
        </Col>
      </Row>
      <Row className={`mb-5 ${auth.username ? '' : 'd-none'}`}>
        <Col>
          <Button
            variant={blogFormVisible ? 'secondary' : 'primary'}
            className="mt-2"
            onClick={toggleBlogForm}
          >
            {blogFormVisible ? 'Cancel' : 'Create new blog'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <ListGroup>
            {
              sortedBlogs
                .map((blog) =>
                  <LinkContainer key={blog.id} to={`/blogs/${blog.id}`}>
                    <ListGroup.Item
                      key={blog.id}
                      action
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold lh-lg fs-5'>
                          {blog.title}
                        </div>
                        <div className='fs-6 fw-light'>
                          {prettyCount(
                            blog.comments.length ?? 0,
                            'comment',
                            'comments',
                            'No comments'
                          )}
                        </div>
                      </div>
                      <Badge pill>
                        {blog.likes}
                      </Badge>
                    </ListGroup.Item>
                  </LinkContainer>
                )
            }
          </ListGroup>
        </Col>
      </Row>
    </Container >
  )
}

export default Blogs