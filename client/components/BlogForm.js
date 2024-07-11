import { useState } from 'react'
import { FloatingLabel, Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import { useAddNewBlogMutation } from '../reducers/blogApi'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [postBlog, { isLoading }] = useAddNewBlogMutation()

  const onSubmit = (event) => {
    event.preventDefault()
    postBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Form onSubmit={onSubmit}>
      <Row className="align-items-center">
        <Col lg="6">
          <FloatingLabel
            controlId="floatingTitleLabel"
            label="Title"
            className='mb-3'
          >
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Blog title"
              className="me-2"
              aria-label="Blog title"
            />
          </FloatingLabel>
        </Col>
        <Col lg="auto">
          <FloatingLabel
            controlId="floatingAuthorLabel"
            label="Author"
            className='mb-3'
          >
            <Form.Control
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Author"
              className="me-2"
              aria-label="Author"
            />
          </FloatingLabel>
        </Col>
        <Col lg="auto">
          <FloatingLabel
            controlId="floatingUrlLabel"
            label="URL"
            className='mb-3'
          >
            <Form.Control
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Blog URL"
              className="me-2"
              aria-label="Blog URL"
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col lg="auto">
          <Button variant="primary" type='submit'>
            Submit
            {
              isLoading &&
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className='ms-2' />
            }
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default BlogForm
