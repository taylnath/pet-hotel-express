import {Alert, Container, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
import ConfirmDelete from "../Components/Modals/ConfirmDelete";
import LoadingStatus from "../Components/LoadingStatus";

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
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [deleteAlertMessage, setDeleteAlertMessage] = useState("This owner could not be deleted.");
  
  // user, data states
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // -------- effects --------
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible && !confirmDeleteVisible) {
      setUpdateMode(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setOwnerId('');
      loadingStatus.cancelled ?
          setLoadingStatus({loading: false, error: false}) :
          setLoadingStatus({loading: true, error: false});
    }
  }, [modalVisible, confirmDeleteVisible])
  
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
    fetch(`/api/owners/deletable/${row.ownerId}`)
      .then(res => res.json())
      .then(res => {
        console.log("deletable result message:", res);
        if (res.success === false && res.message){
          setDeleteAlertMessage(res.message);
          setDeleteAlertVisible(true);
        } else {
          setConfirmDeleteVisible(true);
          console.log('deleting row:', row);
        }
      })
      .catch(e => console.error(e));
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
    // Todo:  clear Add Owner modal
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
          <GenericModal
            title="Owner not deleted!"
            visible={deleteAlertVisible}
            setVisible={setDeleteAlertVisible}
            setLoadingStatus={() => {}}
            action={() => {}}
          >
            <p className="modal-subtitle">
              {deleteAlertMessage}
            </p>
          </GenericModal>

          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Owner
          </Button>
  
          <LoadingStatus status={loadingStatus}/>
          
          <GenericModal
              title={(updateMode)? 'Update Owner' : 'Add a Owner'}
              visible={modalVisible}
              setVisible={setModalVisible}
              setLoadingStatus={setLoadingStatus}
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
  
          {confirmDeleteVisible ?
              <ConfirmDelete
                  title={'Delete Owner'}
                  deleteText={`${firstName} ${lastName}`}
                  visible={confirmDeleteVisible}
                  setVisible={setConfirmDeleteVisible}
                  setLoadingStatus={setLoadingStatus}
                  action={deleteOwner}
              />
              : ''
          }
          
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


