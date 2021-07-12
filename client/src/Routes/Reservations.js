import ReservationModal from '../Components/ReservationModal';
import {useState, useEffect} from 'react';
import settings from '../appSettings';
import {Button, Container} from 'react-bootstrap';
import fetchState from '../DataAccess/fetchState';
import ShowReport from '../Components/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';

import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';
const serverURL = settings.serverURL;
function Reservations(props) {
  const [loginVisible, setLoginVisible] = useState(false);
  const [userPets, setUserPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [reservationRenderSwitch, setReservationRenderSwitch] = useState(false);
  const [modalTitle, setModalTitle] = useState('Make a Reservation');
  const [modalData, setModalData] = useState({ // TODO : modal data here is based on other state. Is that bad?
    petId: '',
    startDate: today,
    endDate: tomorrow
  });
  const [showUpdate, setShowUpdate] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  // this updates the modalData whenever userPets or loginVisible changes
  // it sets up the data initially, and clears after the modal gets closed
  useEffect(() => {
    if (!loginVisible){
      setSelectedPetId((userPets && userPets.length && userPets[0].petId)? userPets[0].petId : '');
      setModalData({
        petId: userPets && userPets.length && userPets[0].petId,
        startDate: today,
        endDate: tomorrow
      });
    }
  }, [userPets, loginVisible, modalVisible]);

  // reset modal title
  useEffect(() => (!loginVisible) && setModalTitle('Make a Reservation'), [loginVisible]);

  function updateReservation(row){
    setModalTitle('Update your Reservation');
    setModalData({petId: row.petId, startDate: row.startDate, endDate: row.endDate});
    setLoginVisible(true);
    console.log(row);
  }

  async function deleteReservation(row){
    console.log(row);
    // TODO: get confirmation first
    let result = await fetch(`${serverURL}/api/reservations/${row.bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    console.log(result);
    setReservationRenderSwitch((reservationRenderSwitch) ? false : true);
  }
  // useEffect(() => getPets, [props.user.ownerId]);
  useEffect(() => {
    console.log("getting pets");
    if (props.user.ownerId != null) {
      console.log("found pets for user");
      fetch(`${serverURL}/api/ownerPets/${props.user.email}`) // todo: change this to id
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
    fetchState(`${serverURL}/api/getReport?tables=Bookings,Pets&where=ownerId,${props.user.ownerId}`, setIsLoaded, setUserReservations, setError);
    console.log('reservations changed...');
  }, [props.user.ownerId, reservationRenderSwitch]);
  useEffect(() => console.log("res is", userReservations), [userReservations]);
  // console.log(userPets);
  const bloop = ['hi', 'hello', 'hey'];
  const headers = {
    bookingId : "Booking Id",
    name: "Pet",
    startDate: "Start Date",
    endDate: "End Date"
  };

  // TODO: create reservation update endpoint, fix wrong date data getting sent on create. 

  const attributes = Object.keys(headers);
  return (
    <div>
      <Container className="m-5">
        <h1>Reservations</h1>
        <ReservationModal 
          title={modalTitle}
          data={modalData}
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
        <Button 
          variant="success" 
          disabled={!props.user.logged_in} 
          onClick={() => (props.user.logged_in) ? setModalVisible(true) : console.log("not logged in")}
        >
          Make a reservation
        </Button>

        {/* begin generic modal example */}
        <GenericModal 
          title="Make a Reservation"
          visible={modalVisible}
          setVisible={setModalVisible}
          action={() => console.log("submitted")}
        >
          <Select 
            id="select-a-pet"
            label="Select a pet"
            name="pet"
            value={selectedPetId} 
            setValue={setSelectedPetId}
            optionsList={userPets}
            optionKey="petId"
            optionValue="name"
          />
          <Date
            id="start-date"
            label="Checkin Date"
            name="start-date"
            value={startDate} // todo: couple this with data that actually gets sent
            setValue={setStartDate}
          />
          <Date
            id="end-date"
            label="Checkout Date"
            name="end-date"
            value={endDate} // todo: couple this with data that actually gets sent
            setValue={setEndDate}
          />

        </GenericModal>
        {/* end generic modal example */}

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
          report_rows={userReservations}
          onUpdate={updateReservation}
          onDelete={deleteReservation}
        />
      </Container>
    </div>
  );
}

export default Reservations;