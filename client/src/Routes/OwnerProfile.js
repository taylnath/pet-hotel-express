import {useState, useEffect} from 'react';
import {Button, Container} from 'react-bootstrap';
import fetchState from '../DataAccess/fetchState';
import ShowReport from '../Components/Reports/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';
import postState from '../DataAccess/postState';
import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';

// OwnerProfile
// Page for owners to change their pets
// Props: user

function OwnerProfile(props) {
  // --- state ---
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // modal state
  const [updateMode, setUpdateMode] = useState(false); // this seems a little awkward, but works for switching between update and insert
  const [modalVisible, setModalVisible] = useState(false);

  // user state
  const [userPets, setUserPets] = useState([]);
  const [petId, setPetId] = useState('');
  const [petName, setPetName] = useState('');
  const [petPreferences, setPetPreferences] = useState('');
  const [petType, setPetType] = useState('');

  // put the values of a database row into the state
  // also when used without row (or with row == null), 
  // clears state
  function mapRowToState(row)
  {
    let clearState = (row == null);
    setPetId((clearState)? '' : row.petId);
    setPetName((clearState)? '' : row.name);
    setPetPreferences((clearState)? '' : row.preferences);
    setPetType((clearState)? '' : row.type);
  }

  // --- effects ---
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible){
      setUpdateMode(false);
      mapRowToState(null);
    } 
  }, [modalVisible]);

  // get/refresh user pets
  async function refreshPets()
  {
    console.log("getting pets");
    if (props.user && props.user.ownerId && props.user.ownerId != null) {
      console.log("found pets for user");
      await fetchState(`/api/ownerPets/${props.user.email}`, setIsLoaded, setUserPets, setError); // todo: change this to id
    } else {
      console.log("no logged in user to find pets for");
      setUserPets([]);
    }
  }

  // refresh pets on owner change and visible modal change
  useEffect(() => refreshPets(), [props.user.ownerId, modalVisible]);

  // TODO: allow adding other owner's pets, i.e. linking pets together

  // --- actions ---
  // add or update a pet, depending on mode
  async function makeReservation() {
    const url = `/api/pets`;
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
  };

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

export default OwnerProfile;
