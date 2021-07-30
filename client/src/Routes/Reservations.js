import {useState, useEffect} from 'react';
import {Button, Container} from 'react-bootstrap';
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from '../Components/Reports/ShowReport';
import {today, tomorrow} from '../Helpers/dateHelpers';
import GenericModal from '../Components/GenericModal';
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';
import formEndDateHelper from "../Helpers/formEndDateHelper";
import ConfirmDelete from "../Components/Modals/ConfirmDelete";

// Reservations
// Page for owners to make reservations
// Props: user

function Reservations(props) {
  // --- state ---
  // loading status
  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    error: false
  });

  // modal state
  const [updateMode, setUpdateMode] = useState(false); // this seems a little awkward, but works for switching between update and insert
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

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
      getState(`/api/ownerPets/${props.user.email}`, setUserPets, setLoadingStatus)
        .then(res => {
          console.log("found pets for user:", res);
          setSelectedPetId((res && res.length)? res[0].petId : '');
        });
      // fetch(`/api/ownerPets/${props.user.email}`) // todo: change this to id
      //   .then(res => res.json())
      //   .then(res => {
      //     setSelectedPetId((res && res.length)? res[0].petId : '');
      //     return setUserPets(res);
      //   });
    } else {
      console.log("no logged in user to find pets for");
      setSelectedPetId('');
      setUserPets([]);
    }
  }, [props.user.ownerId]);

  // refresh reservations on owner change and visible modal change
  async function refreshReservations(){
    getState(`/api/dynamic?tables=Bookings,Pets&where=ownerId,${props.user.ownerId}`, setUserReservations, setLoadingStatus);
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
      response = await putState(url, data, setLoadingStatus);
    } else {
      response = await postState(url, data, setLoadingStatus);
    }
    console.log('made reservation. Got response', response);
    await refreshReservations();
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row) {
    setBookingId(row.bookingId);
    setConfirmDeleteVisible(true);
  }
  
  function setEndDateMin (formStartDate) {
    // set new startDate State from form
    setStartDate(formStartDate);
    
    // If form startDate is now > endDate, make endDate 'value' & 'min' = startDate + 1 day
    // Otherwise, leave form endDate as it is
    let endDateMin = formEndDateHelper(formStartDate, endDate);
    if(endDateMin) {
      document.getElementById("end-date").setAttribute("min", endDateMin);
      setEndDate(endDateMin);
    }
  }

  async function deleteReservation(row){
    console.log(row);
    let result = await deleteState(`/api/reservations/${bookingId}`, setLoadingStatus);
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
            setValue={setEndDateMin}
          />
          <Date
            id="end-date"
            label="Checkout Date"
            name="end-date"
            value={endDate} // todo: couple this with data that actually gets sent
            setValue={setEndDate}
          />
        </GenericModal>
  
        {confirmDeleteVisible ?
            <ConfirmDelete
                title={'Delete Reservation'}
                deleteText={`reservation ${bookingId}`}
                visible={confirmDeleteVisible}
                setVisible={setConfirmDeleteVisible}
                action={deleteReservation}
            />
            : ''
        }

        <div>{userPets.length > 0 ? "Your pets:" : userPets.keys()}
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
          onDelete={confirmDelete}
        />
      </Container>
    </div>
  );
}

export default Reservations;