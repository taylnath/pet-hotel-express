import ReservationModal from '../Components/ReservationModal';
import {useState, useEffect} from 'react';
import settings from '../appSettings';
import {Button} from 'react-bootstrap';
import fetchState from '../DataAccess/fetchState';
import ShowReport from '../Components/ShowReport';
const serverURL = settings.serverURL;
function Reservations(props) {
  const [loginVisible, setLoginVisible] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  // useEffect(() => getPets, [props.user.ownerId]);
  useEffect(() => {
    console.log("getting pets");
    if (props.user.ownerId != null) {
      console.log("found pets for user");
      fetch(`${serverURL}/api/ownerPets/${props.user.email}`)
        .then(res => res.json()).then(res => {
          console.log(res);
          setSelectedPetId(res[0].petId);
          return setUserPets(res);
        });
    }
    else {
      console.log("no logged in user to find pets for");
      setSelectedPetId('');
      setUserPets([]);
    }
  }, [props.user.ownerId]);

  useEffect(() => {
    fetchState(`${serverURL}/api/getReport?tables=Bookings,Stays,Pets`, setIsLoaded, setUserReservations, setError);
  }, [props.user.ownerId]);
  useEffect(() => console.log("res is", userReservations), [userReservations]);
  console.log(userPets);
  const bloop = ['hi', 'hello', 'hey'];
  const headers = {
    bookingId : "Id",
    name: "Pet",
    startDate: "Start Date",
    endDate: "End Date"
  };

  const attributes = Object.keys(headers);
  return (
    <div>
      <h1>Reservations</h1>
      TODO: make reservations personalized... also format date.
      <p>
        Your name: {props.user.firstName}
        Your user id: {props.user.ownerId}
      </p>
      <ReservationModal 
        loginVisible={loginVisible} 
        user={props.user} 
        setUser={props.setUser} 
        setLoginVisible={setLoginVisible}
        userPets={userPets}
        selectedPetId={selectedPetId}
        setSelectedPetId={setSelectedPetId}
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
      <ShowReport 
        title="Your Reservations"
        headers={headers}
        attributes={attributes}
        report_rows={[headers, ...userReservations]}
      />
    </div>
  );
}

export default Reservations;