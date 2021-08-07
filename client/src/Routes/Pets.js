import {Alert, Container, Button, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
import Select from '../Components/Forms/Select';
import LoadingStatus from '../Components/LoadingStatus';
import ConfirmDelete from '../Components/Modals/ConfirmDelete';


// Pets
//page for managers to manage Pets

function Pets() {
  // -------- state --------
  // loading status
  const [loadingStatus, setLoadingStatus] = useState({
    loading: true,
    error: false
  });
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [deleteAlertMessage, setDeleteAlertMessage] = useState("This pet could not be deleted.");
  const [sqlAlertVisible, setSqlAlertVisible] = useState(false);
  const [sqlAlertMessage, setSqlAlertMessage] = useState("There was an issue performing your request.");
  
  // user, data states
  const [pets, setPets] = useState([]);
  const [description, setDescription] = useState('');
  const [petId, setPetId] = useState('');
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState('');
  const [type, setType] = useState('cat');
  
  // -------- effects --------
  useEffect(() => {
    console.log("loading status changed to", loadingStatus.loading);
  }, [loadingStatus]);

  // reset modal data when it closes
  useEffect(async () => {
    if (!modalVisible && !confirmDeleteVisible) {
      setUpdateMode(false);
      setName('');
      setPreferences('');
      setPetId('');
      setType('cat');
      loadingStatus.cancelled ?
          setLoadingStatus({loading: false, error: false}) :
          setLoadingStatus({loading: true, error: false});
    }
  }, [modalVisible, confirmDeleteVisible])

  useEffect(async () => await refreshPets(), [])

  async function refreshPets() {
      await getState(`/api/dynamic?tables=Pets`, setPets, setLoadingStatus);
  }
  
  
  // -------- ShowReport Interactions --------
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    setUpdateMode(true);
    setPetId(row.petId);
    setName(row.name);
    setPreferences(row.preferences);
    setPetId(row.petId);
    setType(row.type);
    setModalVisible(true);
    console.log('updating row:', row);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    setPetId(row.petId);
    setName(row.name);
    fetch(`/api/pets/deletable/${row.petId}`)
      .then(res => res.json())
      .then(res => {
        if (res.success === false && res.message){
          setDeleteAlertMessage(res.message);
          setDeleteAlertVisible(true);
          setPetId('');
          setName('');
          setPreferences('');
        } else {
          setConfirmDeleteVisible(true);
          console.log('deleting row:', row);
        }
      })
      .catch(e => console.error(e));
  }

  // todo: this should be called addOrUpdatePet
  async function updatePet() {
    const url = '/api/dynamic';
    let response;
    const data = {
      table: 'Pets',
      fieldValues: {
        name: name,
        preferences: preferences,
        type: type
      }
    };
    if (updateMode) {
      // todo: combine identifier and id into an object
      data.identifier = 'petId';
      data.id = petId;
      response = await putState(url, data, setLoadingStatus);
    } else {
      response = await postState(url, data, setLoadingStatus);
    }
    
    if (!response.success && response.sqlMessage){
      setSqlAlertMessage(response.sqlMessage);
      setSqlAlertVisible(true);
    } else {
      console.log('Pet updated. Got response', response);
    }
    
    await refreshPets();
  }

  async function deletePet(){
    let result = await deleteState(`/api/dynamic/Pets/petId/${petId}`, setLoadingStatus);
    console.log(result);
    setPetId('');
    await refreshPets();
  }
  // report headers
  const headers = {
    petId: "Id",
    preferences: "Preferences",
    name: "Name",
    type: "Type"
  }
  const attributes = ["petId", "name", "preferences", "type"];
  

  return (
      <div>
        <Container>
          <h1 className={"mt-5 mb-3"}>Pets</h1>
        </Container>
        
        <Container>
          <GenericModal
            title="Database Conflict!"
            visible={sqlAlertVisible}
            setVisible={setSqlAlertVisible}
            setLoadingStatus={() => {}}
            action={() => {}}
          >
            <p className="modal-subtitle">
              {sqlAlertMessage}
            </p>
          </GenericModal>

          <GenericModal
            title="Pet not deleted!"
            visible={deleteAlertVisible}
            setVisible={setDeleteAlertVisible}
            setLoadingStatus={() => {}}
            action={() => {}}
          >
            <p className="modal-subtitle">
              {deleteAlertMessage}
            </p>
          </GenericModal>

          <Button variant="success shadow" onClick={() => {setModalVisible(true);}}>
            Add New Pet
          </Button>

          <LoadingStatus status={loadingStatus}/>
          
          <GenericModal
              title={(updateMode)? 'Update Pet' : 'Add a Pet'}
              visible={modalVisible}
              setVisible={setModalVisible}
              setLoadingStatus={setLoadingStatus}
              action={updatePet}
          >
            <Input
                id="name"
                label="Name"
                name="name"
                value={name}
                setValue={setName}
            />
            <Input
                id="preferences"
                label="Preferences"
                name="preferences"
                value={preferences}
                setValue={setPreferences}
            />
            <Select
                id="type"
                label="Type"
                name="type"
                value={type}
                setValue={setType}
                optionsList={[{value: "cat"}, {value: "dog"}]}
                optionKey="value"
                optionValue="value"
            />
          </GenericModal>
  
          {confirmDeleteVisible ?
            <ConfirmDelete
              title={'Delete Pet'}
              deleteText={`${name}`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              setLoadingStatus={setLoadingStatus}
              action={deletePet}
          />
          : ''
          }
          
        </Container>
        
        <Container>
          
          <h4 className={"mt-5"}>Pet List:</h4>
          <ShowReport title="Pet List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={pets}
                      onUpdate={makeUpdateModal}
                      onDelete={confirmDelete}/>
        
        </Container>
      
      </div>
  );
}

export default Pets;

