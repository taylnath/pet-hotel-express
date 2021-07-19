import {Container, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
import Select from '../Components/Forms/Select';

// Pets
//page for managers to manage Pets


function Pets() {
  // -------- state --------
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // user, data states
  const [pets, setPets] = useState([]);
  const [description, setDescription] = useState('');
  const [petId, setPetId] = useState('');
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState('');
  const [type, setType] = useState('');
  
  // -------- effects --------
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setName('');
      setPreferences('');
      setPetId('');
      setType('');
    }
  }, [modalVisible])

  useEffect(async () => {
    await fetchState(`/api/dynamic?tables=Pets`, setIsLoaded, setPets, setError);
  }, [])
  
  
  // -------- ShowReport Interactions --------
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    console.log("row = ", row)
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
    console.log("row = ", row)
    setPetId(row.petId);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }

  const refreshPets = () => {};
  const updatePet = () => {};
  const deletePet = () => {};
  
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
          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Pet
          </Button>
          
          <GenericModal
              title={(updateMode)? 'Update Pet' : 'Add a Pet'}
              visible={modalVisible}
              setVisible={setModalVisible}
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
  
          <GenericModal
              title={`Are you sure you want to delete pet ${petId}?`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              action={deletePet}
          />
          
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

