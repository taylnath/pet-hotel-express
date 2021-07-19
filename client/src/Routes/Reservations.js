import {useState, useEffect} from 'react';
import {Button, Container} from 'react-bootstrap';
import fetchState from '../DataAccess/fetchState';
import ShowReport from '../Components/Reports/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';
import postState from '../DataAccess/postState';
import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';

// Reservations
// Page for owners to make reservations
// Props: user

function Reservations(props) {
  // --- state ---
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // modal state
  const [updateMode, setUpdateMode] = useState(false); // this seems a little awkward, but works for switching between update and insert
  const [modalVisible, setModalVisible] = useState(false);

  // user state
  const [userPets, setUserPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [bookingId, setBookingId] = useState('');
  const [userReservations, setUserReservations] = useState([]);

  // --- effects ---
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible){
      setUpdateMode(false);
      setSelectedPetId((userPets && userPets.length)? userPets[0].petId : '');
      setStartDate(today);
      setEndDate(tomorrow);
      setBookingId('');
    } 
  }, [modalVisible]);

  // get/refresh user pets
  useEffect(() => {
    console.log("getting pets");
    if (props.user && props.user.ownerId && props.user.ownerId != null) {
      console.log("found pets for user");
      fetch(`/api/ownerPets/${props.user.email}`) // todo: change this to id
        .then(res => res.json()).then(res => {
          setSelectedPetId((res && res.length)? res[0].petId : '');
          return setUserPets(res);
        });
    } else {
      console.log("no logged in user to find pets for");
      setSelectedPetId('');
      setUserPets([]);
    }
  }, [props.user.ownerId]);

  // refresh reservations on owner change and visible modal change
  async function refreshReservations(){
    fetchState(`/api/getReport?tables=Bookings,Pets&where=ownerId,${props.user.ownerId}`, setIsLoaded, setUserReservations, setError);
    console.log('updated reservations');
  };
  useEffect(() => refreshReservations(), [props.user.ownerId, modalVisible]);

  // --- actions ---
  // make a new reservation or update one, depending on mode
  async function makeReservation() {
    const url = `/api/reservations`;
    let response;
    const data = {
      startDate: startDate,
      endDate: endDate,
      ownerId: props.user.ownerId, 
      petId: selectedPetId
    };
    if (updateMode){
      data.bookingId = bookingId;
      response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } else {
      response = await postState(url, data);
    }
    let body = await response.json();
    console.log('made reservation. Got response', body);
    await refreshReservations();
  }

  async function deleteReservation(row){
    console.log(row);
    // TODO: get confirmation first
    let result = await fetch(`/api/reservations/${row.bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    console.log(result);
    await refreshReservations();
  }

  // --- ShowReport interactions ---
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    setUpdateMode(true);
    setBookingId(row.bookingId);
    setSelectedPetId(row.petId);
    setStartDate(row.startDate);
    setEndDate(row.endDate);
    setModalVisible(true);
    console.log('updating row:', row);
  }

  // headers for report
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
        <Button 
          variant="success" 
          disabled={!props.user.logged_in} 
          onClick={() => (props.user.logged_in) ? setModalVisible(true) : console.log("not logged in")}
        >
          Make a reservation
        </Button>

        <GenericModal 
          title={(updateMode)? 'Update a Reservation' : 'Make a Reservation'}
          visible={modalVisible}
          setVisible={setModalVisible}
          action={makeReservation}
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
          onUpdate={makeUpdateModal}
          onDelete={deleteReservation}
        />
      </Container>
    </div>
  );
}

export default Reservations;