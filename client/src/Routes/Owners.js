import {Container, Button} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
const serverURL = settings.serverURL;

// Owners
//page for managers to manage Owners


function Owners() {
  // -------- state --------
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // user, data states
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // -------- effects --------
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setOwnerId('');
    }
  }, [modalVisible])

  useEffect(async () => {
    await fetchState(`${serverURL}/api/getReport?tables=Owners`, setIsLoaded, setOwners, setError);
  }, [])
  
  
  // -------- ShowReport Interactions --------
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    console.log("row = ", row)
    setUpdateMode(true);
    setOwnerId(row.ownerId);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setEmail(row.email);
    setModalVisible(true);
    console.log('updating row:', row);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    console.log("row = ", row)
    setOwnerId(row.ownerId);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }

  const refreshOwners = () => {};
  const updateOwner = () => {};
  const deleteOwner = () => {};
  
  // report headers
  const headers = {
    ownerId: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email"
  }
  const attributes = ["ownerId", "firstName", "lastName", "email"]
  

  return (
      <div>
        <Container>
          <h1 className={"mt-5 mb-3"}>Owners</h1>
        </Container>
        
        <Container>
          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Owner
          </Button>
          
          <GenericModal
              title={(updateMode)? 'Update Owner' : 'Add a Owner'}
              visible={modalVisible}
              setVisible={setModalVisible}
              action={updateOwner}
          >
            <Input
                id="firstName"
                label="First Name"
                name="firstName"
                value={firstName}
                setValue={setFirstName}
            />
            <Input
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                setValue={setLastName}
            />
            <Input
                id="email"
                label="Email"
                name="email"
                value={email}
                setValue={setEmail}
            />
          </GenericModal>
  
          <GenericModal
              title={`Are you sure you want to delete owner ${ownerId}?`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              action={deleteOwner}
          />
          
        </Container>
        
        <Container>
          
          <h4 className={"mt-5"}>Owner List:</h4>
          <ShowReport title="Owner List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={owners}
                      onUpdate={makeUpdateModal}
                      onDelete={confirmDelete}/>
        
        </Container>
      
      </div>
  );
}

export default Owners;


