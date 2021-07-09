import { useState, useEffect } from 'react';
import settings from '../appSettings';
import fetchState from '../DataAccess/fetchState';
import postState from '../DataAccess/postState';
import {
  Button, Modal, Container, Row, Col
} from 'react-bootstrap';
import blankUser from '../Models/UserModel';
const serverURL = settings.serverURL;
console.log(serverURL);

// adapted from https://reactjs.org/docs/faq-ajax.html
function ReservationModal(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [ownerPets, setOwnerPets] = useState([]);
  const [reservationDetails, setReservationDetails] = useState({
    startDate: new Date(),
    endDate: new Date(),
    numberOfRooms: 1,
    ownerEmail: props.user.email // TODO ? change to id?
  });

  async function logInOwner(e) {
    e.preventDefault();
    props.setLoginVisible(false);
    
    // Could use fetchState if we want a "loading" screen later
    const url = serverURL + `/api/reservations`;

    await postState(url, reservationDetails);
    console.log("Loaded?", loaded);
    console.log("Error?", error);

    // const users = await fetch(fetchURL).then(response => response.json());
    // console.log('found user', users[0]);

  //   if (users.length == 1){
  //     let userType = props.user.type;       // TODO: fix this hack
  //     let login_user = users[0];     // needed a way to add 'logged_in' attribute
  //     login_user.logged_in = true;
  //     // TODO: fix this hack
  //     props.setUser({...login_user, type: userType});    // TODO: give feedback for case where user type is wrong
  //                                   // TODO: verify employees are actually employees (type for model?)
  //   } else {                        // if no match, reset local State
  //     console.log(users[0]?.type, "doesn't match", props.user.type);
  //     props.setUser(blankUser);
  //   }
  
  //   console.log('user now = ', props.user);
  };

  let loginField = (props.user.type === "owner") ?
    (
      <span>
        <label className={"col-form-label"}>
          E-mail:
        </label>
        <input type={"email"} className={"form-control"}
                id={"owner-email"} value={props.user.email}
              onChange={(e) => props.setUser({...props.user, email: e.target.value})}/>
      </span>
    ) : (
      <span>
        <label className={"col-form-label"}>
          Employee Id:
        </label>
        <input type={"text"} className={"form-control"}
                id={"employee-id"} value={props.user.employeeID}
              onChange={(e) => props.setUser({...props.user, employeeID: e.target.value})}/>
      </span>
    );
  
    if (!props.user.logged_in){
      return <div>Please log in to make a reservation.</div>
    };

    return (
        <Modal animation={false} show={props.loginVisible} onHide={() => props.setLoginVisible(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {(props.user.type == "employee") ? "Employee Login" : "Owner Login"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={logInOwner}>
              {loginField}
              <Container className={"p-3"}>
                <Row>
                  <Col>
                  <Button variant="primary" md={4} type={"submit"}>
                    Log in
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