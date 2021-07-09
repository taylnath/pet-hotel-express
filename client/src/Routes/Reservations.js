import ReservationModal from '../Components/ReservationModal';
import {useState} from 'react';
import settings from '../appSettings';
const serverURL = settings.serverURL;
function Reservations(props) {

  const [loginVisible, setLoginVisible] = useState(false);
  return (
    <div>
      <h1>Reservations</h1>
      <ReservationModal 
        loginVisible={loginVisible} 
        user={props.user} 
        setUser={props.setUser} 
        setLoginVisible={setLoginVisible}
      />
      <button onClick={() => setLoginVisible(true)}>click me</button>
      {/* get owner pets */}
      <button onClick={() => fetch(`${serverURL}/api/ownerPets/${props.user.email}`).then(res => res.json()).then(res => console.log(res))}>now click me</button>
    </div>
  );
}

export default Reservations;