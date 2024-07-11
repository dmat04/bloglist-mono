import { useState } from 'react'
import { ListGroup, Button, Form, InputGroup, Card, Spinner } from 'react-bootstrap'
import { EmptyState } from '../util/common'
import { usePostCommentMutation } from '../reducers/blogApi'

const Comments = ({ blog }) => {
  const [postComment, { isLoading }] = usePostCommentMutation()
  const [comment, setComment] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    try {
      await postComment({ blog, comment })
    } catch (ex) {
      console.log(ex)
    }

    setComment('')
  }

  return (
    <>
      <Form onSubmit={onSubmit} className='mb-3'>
        <InputGroup>
          <Form.Control
            placeholder="Add a comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <Button variant="success" type="submit" disabled={comment.length > 0 ? false : true}>
            {
              isLoading &&
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className='me-2' />
            }
            Comment
          </Button>
        </InputGroup>
      </Form>

      {
        blog.comments.length > 0 &&
        <Card>
          <Card.Header as="h5">
            Comments
          </Card.Header>
          <ListGroup variant='flush'>
            {
              blog.comments
                .map((comment, i) =>
                  <ListGroup.Item
                    key={`${blog.id}_${i}`}
                    className='d-flex justify-content-between align-items-start'
                  >
                    {comment}
                  </ListGroup.Item>
                )
            }
          </ListGroup>
        </Card>
      }
      {
        !blog.comments.length &&
        <EmptyState message='No comments yet' />
      }
    </>
  )
}

export default Comments