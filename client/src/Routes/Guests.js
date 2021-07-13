import {useState, useEffect} from 'react';
import settings from '../appSettings';
import {Button, Container, Accordion, Card} from 'react-bootstrap';
import fetchState from '../DataAccess/fetchState';
import ShowReport from '../Components/Reports/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';
import postState from '../DataAccess/postState';
import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';
const serverURL = settings.serverURL;

// Guests
// Page for employees to add/delete owners' pets to change their pets
// Props: user

function Guests(props) {
  const [ownerPets, setOwnerPets] = useState([]);

  async function refreshOwnerPets(){
    let ownerPetsList = [];
    let owners = await fetch(`${serverURL}/api/owners`)
      .then(res => (res.ok)? res.json() : Promise.reject())
      .catch(err => console.log(err));
    console.log(owners);
    for (let owner of owners){
      let pets = await fetch(`${serverURL}/api/ownerPets/${owner.email}`) // todo: change this to owner.ownerId
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
  return (
    <Container className="m-5">
      <Accordion defaultActiveKey="0">
        {ownerPets.map(x => {
          return (
            <Card key={x.owner.ownerId}>
              <Accordion.Toggle as={Card.Header} eventKey={x.owner.ownerId}>
                {x.owner.firstName} {x.owner.lastName}'s Pets:
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={x.owner.ownerId}>
                <Card.Body>
                  <Card>
                    <Card.Body>
                      Add a pet for {x.owner.firstName}: 
                      <Button variant="success" className="ml-3">Add</Button>
                    </Card.Body>
                  </Card>
                  <ShowReport
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
          <>
            <p hidden>{x.owner.firstName} {x.owner.lastName}'s Pets:</p>
            <ul hidden>
              {x.pets.map(y => <li>{y.name}</li>)}
            </ul>
          </>
        )
      })}
    </Container>

  );
}

export default Guests;