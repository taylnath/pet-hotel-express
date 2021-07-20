import { useState, useEffect } from 'react';
import fetchState from '../DataAccess/fetchState';
import {
  Button, Modal, Container, Row, Col
} from 'react-bootstrap';
import superUser from '../Models/superUser';

// adapted from https://reactjs.org/docs/faq-ajax.html
function Login(props) {
  async function logInOwner(e) {
    e.preventDefault();
    props.setLoginVisible(false);
    
    // Could use fetchState if we want a "loading" screen later
    const fetchURL = `/api/logIn?type=${props.user.type}&id=${
      (props.user.type == "owner") ? 
      props.user.email :
      props.user.employeeId
    }`;
    const users = await fetch(fetchURL).then(response => response.json());
    console.log('found user', users[0]);

    if (users.length == 1){
      let userType = props.user.type;       // TODO: fix this hack
      let login_user = users[0];     // needed a way to add 'logged_in' attribute
      login_user.logged_in = true;
      // TODO: fix this hack
      props.setUser({...login_user, type: userType});    // TODO: give feedback for case where user type is wrong
                                    // TODO: verify employees are actually employees (type for model?)
    } else {                        // if no match, reset local State
      console.log(users[0]?.type, "doesn't match", props.user.type);
      props.setUser(superUser);
    }
  
    console.log('user now = ', props.user);
    // console.log(fetchURL)
    // const log_owner_in = async () => {
    //   const res = await fetch(fetchURL)
    //   const data = await res.json();
    //   console.log("data = ", data);
    // }
    // log_owner_in()
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
               id={"employee-id"} value={props.user.employeeId}
               onChange={(e) => props.setUser({...props.user, employeeId: e.target.value})}/>
      </span>
      );
  
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

export default Login;