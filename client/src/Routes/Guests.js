import {useState, useEffect} from 'react';
import {Button, Container, Accordion, Card} from 'react-bootstrap';
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from '../Components/Reports/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';
import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';
import {BsChevronCompactDown} from 'react-icons/bs';
import ConfirmDelete from "../Components/Modals/ConfirmDelete";

// Guests
// Page for employees to add/delete owners' pets to change their pets
// Props: user

function Guests(props) {
  // loading status
  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    error: false
  });

  const [allPets, setAllPets] = useState([]);
  const [ownerPets, setOwnerPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedPetName, setSelectedPetName] = useState('');
  const [selectedOwner, setSelectedOwner] = useState([]);
  const [selectedOwnerPets, setSelectedOwnerPets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [availablePets, setAvailablePets] = useState([]);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [guestId, setGuestId] = useState('');

  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible && !confirmDeleteVisible){
      setSelectedPetId((allPets && allPets.length)? allPets[0].petId : '');
      setSelectedOwner([]);
      setSelectedOwnerPets([]);
      setAvailablePets([]);
      setSelectedPetName('');
      setGuestId('');
    } 
  }, [modalVisible, confirmDeleteVisible]);

  useEffect(() => {
    getState(`/api/dynamic?tables=Pets`, setAllPets, setLoadingStatus)
      .then(pets => {
        setSelectedPetId((pets.length > 0) ? pets[0].id : '');
        console.log("got all pets:", pets);
      });
  }, []);

  // todo: this data should be read from all pets array or something
  // todo: use fetchState style
  async function refreshOwnerPets(){
    let ownerPetsList = [];
    let owners = await fetch(`/api/dynamic?tables=Owners`)
      .then(res => (res.ok)? res.json() : Promise.reject())
      .catch(err => console.log(err));
    console.log(owners);
    for (let owner of owners){
      let pets = await fetch(`/api/ownerPets/${owner.email}`) // todo: change this to owner.ownerId
        .then(res => (res.ok)? res.json() : Promise.reject())
        .catch(err => console.log(err));
      ownerPetsList.push({
        owner: owner,
        pets: pets
      });
    }
    console.log("ownerPetsList = ", ownerPetsList);
    setOwnerPets(ownerPetsList);
  }

  useEffect(() => refreshOwnerPets(), []);

  async function addPet() {
    // todo...
    console.log("adding a pet...");
    const url = '/api/dynamic';
    let response;
    const data = {
      table: 'Guests',
      fieldValues: {
        ownerId: selectedOwner.ownerId,
        petId: selectedPetId
      }
    }
      response = await postState(url, data, setLoadingStatus);
      let body = await response.json();
      console.log('Pet updated. Got response', body);
      await refreshOwnerPets();
  }
  
  function makeAddPetModal(selectedOwnerPetData) {
    // construct an array of all Pets not already belonging to selected Owner
    let allPetIds = allPets.map((x) => x.petId);
    let selectedOwnerPetIds = selectedOwnerPetData.map((x) => x.petId);
    let availablePetIds = allPetIds.filter((x) => !selectedOwnerPetIds.includes(x));
    let petsAvailable = allPets.filter((x) => availablePetIds.includes(x.petId))
    setAvailablePets(petsAvailable);
  
    setSelectedPetId((petsAvailable && petsAvailable.length)? petsAvailable[0].petId : '');
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    console.log("row = ", row)
    setSelectedPetId(row.petId);
    setSelectedPetName(row.name);
    setGuestId(row.guestId);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }
  
  async function deleteOwnerPet(){
    
    let result = await deleteState(`/api/dynamic/Guests/guestId/${guestId}`, setLoadingStatus)
        .then(res => res.json());
    console.log(result);
    setGuestId('');
    await refreshOwnerPets();
  }

  return (
    <Container className="m-5">
      <GenericModal
        title={`Link an existing pet ${selectedPetId} with ${selectedOwner.firstName}`}
        visible={modalVisible}
        setVisible={setModalVisible}
        action={addPet}
      >
        <Select
          id="select-a-pet"
          label="Select a pet"
          name="pet"
          value={selectedPetId}
          setValue={setSelectedPetId}
          optionsList={availablePets}
          optionKey="petId"
          optionValue="name" // todo: what if name is not unique
        />
      </GenericModal>
  
      {confirmDeleteVisible ?
          <ConfirmDelete
              title={'Remove Pet from Owner'}
              deleteText={`${selectedPetName} (pet ID ${selectedPetId})`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              action={deleteOwnerPet}
          />
          : ''
      }
      
      <Accordion defaultActiveKey="0">
        {ownerPets.map(x => {
          return (
            <Card key={"outercard" + String(x.owner.ownerId)}>
              <Accordion.Toggle  as={Card.Header} eventKey={x.owner.ownerId} key={"toggle" + String(x.owner.ownerId)} className="w-100">
                {x.owner.firstName} {x.owner.lastName}'s Pets: <BsChevronCompactDown className="mr-3 h3" style={{position:"absolute", right:0}}/>
              </Accordion.Toggle>
              <Accordion.Collapse  eventKey={x.owner.ownerId} key={"collapse" + String(x.owner.ownerId)}>
                <Card.Body key={"cardbody" + String(x.owner.ownerId)}>
                  <Card key={"card" + String(x.owner.ownerId)}>
                    <Card.Body key={"inner cardbody" + String(x.owner.ownerId)}>
                      Add a pet for {x.owner.firstName}: 
                      <Button 
                        key={"button" + String(x.owner.ownerId)}
                        variant="success" 
                        className="ml-3"
                        onClick={e => {
                          e.preventDefault();
                          setSelectedOwner(x.owner);
                          setSelectedOwnerPets(x.pets);
                          makeAddPetModal(x.pets);
                          setModalVisible(true);
                        }}
                      >
                        Add
                      </Button>
                    </Card.Body>
                  </Card>
                  <ShowReport
                    key={"report" + String(x.owner.ownerId)}
                    title={`${x.owner.firstName}'s Pets`}
                    headers={{petId: "ID", name: "Pet", type: "Dog/Cat", preferences: "Preferences"}}
                    attributes={['petId', 'name', 'type', 'preferences']}
                    report_rows={x.pets}
                    onDelete={confirmDelete}
                  />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )
        })}
      </Accordion>

      {ownerPets.map(x => {
        return (
          <div key={"enclosure" + String(x.owner.ownerId)}>
            <p key={"owner" + String(x.owner.ownerId)} hidden>{x.owner.firstName} {x.owner.lastName}'s Pets:</p>
            <ul key={"ownerheader" + String(x.owner.ownerId)} hidden>
              {x.pets.map(y => <li key={"pet" + String(y.petId)}>{y.name}</li>)}
            </ul>
          </div>
        )
      })}
    </Container>

  );
}

export default Guests;