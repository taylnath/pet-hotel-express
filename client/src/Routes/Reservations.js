import ReservationModal from '../Components/ReservationModal';
import {useState, useEffect} from 'react';
import settings from '../appSettings';
const serverURL = settings.serverURL;
function Reservations(props) {

  const getPets = () => fetch(`${serverURL}/api/ownerPets/${props.user.email}`)
    .then(res => res.json()).then(res => {
      console.log(res);
      setSelectedPetID(res[0].petID);
      return setUserPets(res);
    });
  const [loginVisible, setLoginVisible] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [selectedPetID, setSelectedPetID] = useState('');
  useEffect(() => getPets, [props.user]);
  console.log(userPets);
  const bloop = ['hi', 'hello', 'hey'];
  return (
    <div>
      <h1>Reservations</h1>
      <ReservationModal 
        loginVisible={loginVisible} 
        user={props.user} 
        setUser={props.setUser} 
        setLoginVisible={setLoginVisible}
        userPets={userPets}
        selectedPetID={selectedPetID}
        setSelectedPetID={setSelectedPetID}
      />
      <button onClick={() => setLoginVisible(true)}>click me</button>
      <div>Your pets:
        <ul>
          {userPets.map(pet => <li key={pet.name}>{pet.name}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default Reservations;