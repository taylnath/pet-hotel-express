import { useState, useEffect } from 'react';
import fetchState from '../../DataAccess/fetchState';
import postState from '../../DataAccess/postState';
import {
  Button, Modal, Container, Row, Col,
  Form
} from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';
import {today, tomorrow} from '../../Helpers/dateHelpers';

// adapted from https://reactjs.org/docs/faq-ajax.html
function ReservationModal(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [ownerPets, setOwnerPets] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  async function makeReservation(e) {
    e.preventDefault();
    props.setLoginVisible(false);
    
    const url = `/api/reservations`;
    console.log("Loaded?", loaded);
    console.log("Error?", error);
    console.log("selected pet", props.selectedPetId);
    console.log("user id", props.user.ownerId);

    let response = await postState(url, {
      startDate: startDate,
      endDate: endDate,
      ownerId: props.user.ownerId, 
      petId: props.selectedPetId
    });
    let body = await response.json();
    console.log(body);
    console.log(props.switch);
    props.setSwitch((props.switch) ? false : true);
  };

    if (!props.user.logged_in){
      return <div>Please log in to make a reservation.</div>
    }
    return (
        <Modal animation={false} show={props.loginVisible} onHide={() => props.setLoginVisible(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {props.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Selected pet: {props.selectedPetId}. */}
            <form onSubmit={makeReservation}>
              <Container fluid>

                    <label htmlFor="pet-select" className="col-form-label">Select a pet</label>
                    <select 
                      className="form-control"
                      name="pet" id="pet-select" value={props.data.petId} onChange={e => {
                        console.log("target value is", e.target.value);
                        props.setSelectedPetId(e.target.value);
                      }
                    }>
                      {props.userPets.map(pet => <option key={pet.petId} value={pet.petId}>{pet.name}</option>)}
                    </select>

                    <label htmlFor="start-date" className="col-form-label">Checkin Date</label>
                    <input name="start-date" id="start-date" className="form-control" type="date"
                      // value={reservationDetails.startDate.toLocaleDateString('en-CA')}
                      value={props.data.startDate}
                      onChange={e => setStartDate(e.target.value)}
                    ></input>

                    <label htmlFor="end-date" className="col-form-label">Checkout Date</label>
                    <input name="end-date" id="end-date" className="form-control" type="date"
                      // value={reservationDetails.endDate.toLocaleDateString('en-CA')}
                      value={props.data.endDate}
                      onChange={e => setEndDate(e.target.value)}
                    ></input>

              </Container>
              <Container className={"p-3"}>
                <Row>
                  <Col>
                  <Button variant="primary" md={4} type={"submit"}>
                    Submit
                  </Button>
                  </Col>
                  {/* <Col>
                  <Button variant="success" md={4}>
                    Add
                  </Button>
                  </Col> */}
                  <Col>
                  <Button variant="secondary" md={4} onClick={() => props.setLoginVisible(false)}>
                    Cancel
                  </Button>
                  </Col>
                </Row>
              </Container>
            </form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
    );
}

export default ReservationModal;