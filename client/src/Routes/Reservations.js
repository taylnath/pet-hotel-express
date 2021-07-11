import ReservationModal from '../Components/ReservationModal';
import {useState, useEffect} from 'react';
import settings from '../appSettings';
import {Button, Container} from 'react-bootstrap';
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
  const [reservationRenderSwitch, setReservationRenderSwitch] = useState(false);
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
    fetchState(`${serverURL}/api/getReport?tables=Bookings,Stays,Pets&where=ownerId,${props.user.ownerId}`, setIsLoaded, setUserReservations, setError);
    console.log('reservations changed...');
  }, [props.user.ownerId, reservationRenderSwitch]);
  useEffect(() => console.log("res is", userReservations), [userReservations]);
  console.log(userPets);
  const bloop = ['hi', 'hello', 'hey'];
  const headers = {
    bookingId : "Booking Id",
    name: "Pet",
    startDate: "Start Date",
    endDate: "End Date"
  };

  const attributes = Object.keys(headers);
  return (
    <div>
      <Container className="m-5">
        <h1>Reservations</h1>
        <ReservationModal 
          loginVisible={loginVisible} 
          user={props.user} 
          setUser={props.setUser} 
          setLoginVisible={setLoginVisible}
          userPets={userPets}
          selectedPetId={selectedPetId}
          setSelectedPetId={setSelectedPetId}
          switch={reservationRenderSwitch}
          setSwitch={setReservationRenderSwitch}
        />
        <Button variant="danger" disabled={!props.user.logged_in} onClick={() => {
          if (props.user.logged_in){
            setLoginVisible(true);
          }
          else {
            console.log("no user logged in for reservations");
          }
          }}>Make a reservation
        </Button>
        <div>{userPets.length > 0 && "Your pets:"}
          <ul>
            {userPets.map(pet => <li key={pet.name}>{pet.name}</li>)}
          </ul>
        </div>
        <h2>Your Reservations</h2>
        <ShowReport 
          title="Your Reservations"
          headers={headers}
          attributes={attributes}
          report_rows={[headers, ...userReservations]}
        />
      </Container>
    </div>
  );
}

export default Reservations;