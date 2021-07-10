import ReservationModal from '../Components/ReservationModal';
import {useState, useEffect} from 'react';
import settings from '../appSettings';
import {Button} from 'react-bootstrap';
const serverURL = settings.serverURL;
function Reservations(props) {
  const [loginVisible, setLoginVisible] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [selectedPetID, setSelectedPetID] = useState('');
  // useEffect(() => getPets, [props.user.ownerID]);
  useEffect(() => {
    console.log("getting pets");
    if (props.user.ownerID != null) {
      console.log("found pets for user");
      fetch(`${serverURL}/api/ownerPets/${props.user.email}`)
        .then(res => res.json()).then(res => {
          console.log(res);
          setSelectedPetID(res[0].petID);
          return setUserPets(res);
        });
    }
    else {
      console.log("no logged in user to find pets for");
      setSelectedPetID('');
      setUserPets([]);
    }
  }, [props.user.ownerID]);
  console.log(userPets);
  const bloop = ['hi', 'hello', 'hey'];
  return (
    <div>
      <h1>Reservations</h1>
      <p>
        Your name: {props.user.firstName}
        Your user id: {props.user.ownerID}
      </p>
      <ReservationModal 
        loginVisible={loginVisible} 
        user={props.user} 
        setUser={props.setUser} 
        setLoginVisible={setLoginVisible}
        userPets={userPets}
        selectedPetID={selectedPetID}
        setSelectedPetID={setSelectedPetID}
      />
      <Button variant="danger" disabled={!props.user.logged_in} onClick={() => {
        if (props.user.logged_in){
          setLoginVisible(true);
        }
        else {
          console.log("no user logged in for reservations");
        }
      }}>Make a reservation</Button>
      <div>{userPets.length > 0 && "Your pets:"}
        <ul>
          {userPets.map(pet => <li key={pet.name}>{pet.name}</li>)}
        </ul>
      </div>
      <h2>Your Reservations</h2>
      TODO: show the user's reservations in a table or something.
    </div>
  );
}

export default Reservations;