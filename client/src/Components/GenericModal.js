import {Modal, Container, Button, Row, Col} from 'react-bootstrap';

function GenericModal(props){
  return (
    <Modal animation={false} show={props.visible} onHide={() => props.setVisible(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={props.action}>
          <Container fluid>
            {/* form fields are passed as children */}
            {props.children}
          </Container>
          <Container className={"p-3"}>
            <Row>
              <Col>
              <Button variant="primary" md={4} type={"submit"}>
                Ok {/* (or make this a prop?) */}
              </Button>
              </Col>
              <Col>
              <Button variant="secondary" md={4} onClick={() => props.setVisible(false)}>
                Cancel
              </Button>
              </Col>
            </Row>
          </Container>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default GenericModal;