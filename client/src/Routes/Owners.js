import {Container, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
import ConfirmDelete from "../Components/Modals/ConfirmDelete";

// Owners
//page for managers to manage Owners


function Owners() {
  // -------- state --------
  // loading status
  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    error: false
  });
  
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
  
  useEffect(async () => await refreshOwners(), [])
  
  async function refreshOwners() {
    await getState(`/api/dynamic?tables=Owners`, setOwners, setLoadingStatus);
  }
  
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
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }
  
  async function addOrUpdateOwner() {
    const url = '/api/dynamic';
    let response;
    const data = {
      table: 'Owners',
      fieldValues: {
        firstName: firstName,
        lastName: lastName,
        email: email
      }
    };
    if (updateMode) {
      // todo: combine identifier and id into an object
      data.identifier = 'ownerId';
      data.id = ownerId;
      response = await putState(url, data, setLoadingStatus);
    } else {
      response = await postState(url, data, setLoadingStatus);
    }
    let body = await response.json();
    console.log('Owner updated. Got response', body);
    await refreshOwners();
  }
  
  async function deleteOwner(){
    let result = await deleteState(`/api/dynamic/Owners/OwnerId/${ownerId}`, setLoadingStatus)
        .then(res => res.json());
    console.log(result);
    setOwnerId('');
    await refreshOwners();
  }
  
 
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
              action={addOrUpdateOwner}
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
  
          {/*<GenericModal*/}
          {/*    title={`Are you sure you want to delete owner ${ownerId}?`}*/}
          {/*    visible={confirmDeleteVisible}*/}
          {/*    setVisible={setConfirmDeleteVisible}*/}
          {/*    action={deleteOwner}*/}
          {/*/>*/}
  
          <ConfirmDelete
              title={'Delete Owner'}
              deleteText={`${firstName} ${lastName}`}
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


