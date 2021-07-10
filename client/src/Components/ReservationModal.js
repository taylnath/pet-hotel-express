import { useState, useEffect } from 'react';
import settings from '../appSettings';
import fetchState from '../DataAccess/fetchState';
import postState from '../DataAccess/postState';
import {
  Button, Modal, Container, Row, Col,
  Form
} from 'react-bootstrap';
import blankUser from '../Models/UserModel';
import { propTypes } from 'react-bootstrap/esm/Image';
const serverURL = settings.serverURL;
console.log(serverURL);

// adapted from https://reactjs.org/docs/faq-ajax.html
function ReservationModal(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [ownerPets, setOwnerPets] = useState([]);
  // TODO: get user's time zone (not sure how to do that)
  // get tomorrow's date
  let today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [reservationDetails, setReservationDetails] = useState({
    startDate: today,
    endDate: tomorrow,
    numberOfRooms: 1
  });

  async function makeReservation(e) {
    e.preventDefault();
    props.setLoginVisible(false);
    
    // Could use fetchState if we want a "loading" screen later
    const url = serverURL + `/api/reservations`;
    console.log("Loaded?", loaded);
    console.log("Error?", error);
    console.log("selected pet", props.selectedPetID);
    console.log("user id", props.user.ownerID);

    let response = await postState(url, {...reservationDetails, ownerID: props.user.ownerID, petID: props.selectedPetID});
    let body = await response.json();
    console.log(body);
  };

    if (!props.user.logged_in){
      return <div>Please log in to make a reservation.</div>
    }
    return (
        <Modal animation={false} show={props.loginVisible} onHide={() => props.setLoginVisible(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {(props.user.type == "employee") ? "Employee Login" : "Owner Login"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Selected pet: {props.selectedPetID}.
            <form onSubmit={makeReservation}>
              <Container fluid>

                    <label htmlFor="pet-select" className="col-form-label">Select a pet</label>
                    <select 
                      className="form-control"
                      name="pet" id="pet-select" value={props.selectedPetID} onChange={e => {
                        console.log("target value is", e.target.value);
                        props.setSelectedPetID(e.target.value);
                        setReservationDetails({...reservationDetails, petID: e.target.value});
                      }
                    }>
                      {props.userPets.map(pet => <option key={pet.petID} value={pet.petID}>{pet.name}</option>)}
                    </select>

                    <label htmlFor="start-date" className="col-form-label">Checkin Date</label>
                    <input name="start-date" id="start-date" className="form-control" type="date"
                      value={reservationDetails.startDate.toLocaleDateString('en-CA')}
                      onChange={e => setReservationDetails({...reservationDetails, startDate: e.target.value})}
                    ></input>

                    <label htmlFor="end-date" className="col-form-label">Checkout Date</label>
                    <input name="end-date" id="end-date" className="form-control" type="date"
                      value={reservationDetails.endDate.toLocaleDateString('en-CA')}
                      onChange={e => setReservationDetails({...reservationDetails, endDate: e.target.value})}
                    ></input>

              </Container>
              <Container className={"p-3"}>
                <Row>
                  <Col>
                  <Button variant="primary" md={4} type={"submit"}>
                    Submit
                  </Button>
                  </Col>
                  <Col>
                  <Button variant="success" md={4}>
                    Add
                  </Button>
                  </Col>
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