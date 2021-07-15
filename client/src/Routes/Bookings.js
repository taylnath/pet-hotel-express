import {Container, Button} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/Reports/ShowReport";
import {today, tomorrow} from '../Helpers/dateHelpers';
import Input from "../Components/Forms/Input";
import FilterRadioButton from "../Components/Forms/FilterRadioButton";
import GenericModal from "../Components/GenericModal";
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';
const serverURL = settings.serverURL;

// Bookings
//page for managers to manage Bookings


function Bookings() {
  // -------- state --------
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // user, data states
  
  const [filterBy, setFilterBy] = useState('all');
  const [ownerId, setOwnerId] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [userPets, setUserPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [bookingId, setBookingId] = useState('');
  const [bookings, setBookings] = useState([]);
  
  // -------- effects --------
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setOwnerId('')
      setSelectedPetId('');
      setStartDate(today);
      setEndDate(tomorrow);
      setBookingId('');
    }
  }, [modalVisible])
  
  async function refreshBookings(filter) {
    console.log("in Refresh bookings");     // TODO
    console.log("filter? ", filter);
    let where= '';
    if (!(filter === 'all')) {
      filter === 'today' ?
          where = " where `Bookings`.`startDate` = " + `'${today}' ` :
          where = " where `Bookings`.`startDate` = " + `'${tomorrow}' `
    }
    console.log("today = ", today, "tomorrow = ", tomorrow)
    
    console.log("where = ", where)
    let simpleQuery = "select `Bookings`.`bookingId`as `bookingId`, " +
        "`Owners`.`email` as `ownerEmail`, " +
        "concat(`Owners`.`firstName`, ' ', `Owners`.`lastName`) as ownerName, " +
        "`Owners`.`ownerId` as ownerId,  `Pets`.`name` as `petName`, " +
        "`Bookings`.`startDate` as `startDate`, `Bookings`.`endDate` as " +
        "`endDate`, `Rooms`.`roomId` as roomId  from `Bookings` left join " +
        "`Owners` on `Owners`.`ownerId` = `Bookings`.`ownerId` " +
        "left join `Pets` on `Pets`.`petId` = `Bookings`.`petId` left join " +
        "`Rooms` on `Rooms`.`roomId` = `Bookings`.`roomId` " + where + ";"
    
    console.log(simpleQuery)
  
    await fetchState(`${serverURL}/api/simpleQuery?query=` + simpleQuery, setIsLoaded, setBookings, setError);
  }
  
  useEffect(() => refreshBookings(filterBy), []);
  
  // -------- actions --------
  // add / update booking
  
  async function makeReservation() {
    const url = serverURL + `/api/reservations`;
    let response;
    const data = {
      startDate: startDate,
      endDate: endDate,
      ownerId: ownerId,
      petId: selectedPetId
    };
    if (updateMode) {
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
    console.log('made booking. Got response', body);
    await refreshBookings(filterBy);
  }
  
  // Get an Owner's Pets
  async function getPets(row) {
    console.log("getting pets");

    fetch(`${serverURL}/api/ownerPets/${row.ownerEmail}`) // todo: change this to id
          .then(res => res.json()).then(res => {
            for (let i = 0; i < res.length; i++) {
              if (res[i].name === row.petName) {
                setSelectedPetId(res[i].petid)
              }
            }
        setSelectedPetId((res && res.length)? res[0].petId : '');
        return setUserPets(res);
      });
  };
  
  // Delete a Booking
    async function deleteReservation(row){
      console.log(row);
      let result = await fetch(`${serverURL}/api/reservations/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      console.log(result);
      await refreshBookings(filterBy);
    }
  
  
  // Check in or check out a guest
  async function checkIn(row){
    await refreshBookings(filterBy);
  }
  
  // -------- ShowReport Interactions --------
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    console.log("row = ", row)
    getPets(row)
    setUpdateMode(true);
    setBookingId(row.bookingId);
    setOwnerId(row.ownerId);
    setOwnerEmail(row.email);
    setSelectedPetId(row.petId);
    setStartDate(row.startDate);
    setEndDate(row.endDate);
    setModalVisible(true);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    console.log("row = ", row)
    setBookingId(row.bookingId);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }
  
  // report headers
  const headers = {
    bookingId : "Booking Id",
    ownerName: "Owner",
    petName: "Pet",
    startDate: "Start Date",
    endDate: "End Date",
    roomId: "Room",
  };
  const attributes = Object.keys(headers);
  
  return (
      <div>
        <Container>
          <h1 className={"mt-5 mb-5"}>Manage Bookings</h1>
        </Container>
      
        <Container>

              <Button className={"mb-3 mt-1 mr-5"} variant="success" onClick={() => {
                setModalVisible(true);
              }}>
                Add New Reservation
              </Button>
              <span className={"lead font-weight-bold mb-3 mr-2"}>Filter List: </span>
              <FilterRadioButton setFilterBy={setFilterBy}
                                 refresh={refreshBookings}
                                 filterBy={filterBy}
              />

          <div>{filterBy}</div>
        
          <GenericModal
              title={(updateMode) ? 'Update a Reservation' : 'Make a Reservation'}
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
        
          <GenericModal
              title={`Are you sure you want to delete booking ${bookingId}?`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              action={deleteReservation}
          />
      
        </Container>
      
        <Container>
        
          <h4 className={"mt-5"}>Bookings:</h4>
          <ShowReport title="Bookings"
                      headers={headers}
                      attributes={attributes}
                      report_rows={bookings}
                      onUpdate={makeUpdateModal}
                      onDelete={confirmDelete}
                      onCheckIn={checkIn}/>
      
        </Container>
    
      </div>
  );
}

export default Bookings;
