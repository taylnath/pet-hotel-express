import {useState, useEffect} from 'react';
import {Button, Container, Accordion, Card} from 'react-bootstrap';
import fetchState from '../DataAccess/fetchState';
import ShowReport from '../Components/Reports/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';
import postState from '../DataAccess/postState';
import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';

// Guests
// Page for employees to add/delete owners' pets to change their pets
// Props: user

function Guests(props) {
  const [allPets, setAllPets] = useState([]);
  const [ownerPets, setOwnerPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible){
      setSelectedPetId((allPets && allPets.length)? allPets[0].petId : '');
      setSelectedOwner('');
    } 
  }, [modalVisible]);

  useEffect(async () => {
    let pets = await fetch(`/api/dynamic?tables=Pets`).then(res => res.json());
    console.log("got all pets:", pets);
    setAllPets(pets);
    setSelectedPetId((pets.length > 0) ? pets[0].id : '');
  }, []);

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
    console.log(ownerPetsList);
    setOwnerPets(ownerPetsList);
  }

  useEffect(() => refreshOwnerPets(), []);

  function addPet() {
    // todo...
    console.log("adding a pet...");
  };

  // todo: add delete, confirmation

  return (
    <Container className="m-5">
      <GenericModal
        title={`Link an existing pet with ${selectedOwner.firstName}`}
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
          optionsList={allPets}
          optionKey="petId"
          optionValue="name" // todo: what if name is not unique
        />
      </GenericModal>
      <Accordion defaultActiveKey="0">
        {ownerPets.map(x => {
          return (
            <Card key={"outercard" + String(x.owner.ownerId)}>
              <Accordion.Toggle  as={Card.Header} eventKey={x.owner.ownerId} key={"toggle" + String(x.owner.ownerId)}>
                {x.owner.firstName} {x.owner.lastName}'s Pets:
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
                    headers={{name: "Pet", type: "Dog/Cat", preferences: "Preferences"}}
                    attributes={['name', 'type', 'preferences']}
                    report_rows={x.pets}
                    onDelete={() => console.log("deleting pet...")}
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