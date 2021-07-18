import {Container, Button, Form, Row, Col} from "react-bootstrap";
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
  const [checkInMode, setCheckInMode] = useState(false);
  
  // user, data states
  
  const [modalProps, setModalProps] = useState({type: ''});
  const [filterBy, setFilterBy] = useState('all');
  const [owners, setOwners] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');   // can eliminate? TODO
  const [ownerId, setOwnerId] = useState('');
  const [ownerName, setOwnerName] = useState('')
  // const [ownerEmail, setOwnerEmail] = useState('');      can elminate? TODO
  const [userPets, setUserPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [bookingId, setBookingId] = useState('');
  const [searchFirst, setSearchFirst] = useState('');
  const [searchLast, setSearchLast] = useState('');
  const [bookings, setBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  
  
  // -------- Effects ----------------------------------------------------------
  
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setModalProps({type: ''})
      setCheckInMode(false);
      setSelectedOwnerId('');
      setOwnerId('');
      setOwnerName('');
      setSelectedRoomId('');
      setSelectedPetId('');
      setStartDate(today);
      setEndDate(tomorrow);
      setBookingId('');
    }
  }, [modalVisible])
 
  useEffect(() => refreshBookings(filterBy), []);
  
  
  // -------- Actions ----------------------------------------------------------
  
  // ----- Helper Functions -----
  
  // Refresh ShowReport
  async function refreshBookings(filter) {
    
    // Set 'where' conditions, or set to 1 (so subsequent wheres start with 'and')
    let where = " where 1 ";
    if (!(filter === 'all')) {
      filter === 'today' ?
          where = " where `Bookings`.`startDate` = " + `'${today}' ` :
          where = " where `Bookings`.`startDate` = " + `'${tomorrow}' `
    }
    
    if (searchFirst) {
      where += " and `Owners`.`firstName` like '" + `${searchFirst}` + escape('%') + "' "
    }
    if (searchLast) {
      where += " and `Owners`.`lastName` like '" + `${searchLast}` + escape('%') + "' "
    }
    
    let simpleQuery = "select `Bookings`.`bookingId`as `bookingId`, " +
        "`Owners`.`email` as `ownerEmail`, `Pets`.`petId` as `petId`, " +
        "concat(`Owners`.`firstName`, ' ', `Owners`.`lastName`) as ownerName, " +
        "`Owners`.`ownerId` as ownerId,  `Pets`.`name` as `petName`, " +
        "`Bookings`.`startDate` as `startDate`, `Bookings`.`endDate` as " +
        "`endDate`, `Rooms`.`roomId` as roomId  from `Bookings` left join " +
        "`Owners` on `Owners`.`ownerId` = `Bookings`.`ownerId` " +
        "left join `Pets` on `Pets`.`petId` = `Bookings`.`petId` left join " +
        "`Rooms` on `Rooms`.`roomId` = `Bookings`.`roomId` " + where + ";"
    
    console.log(simpleQuery)
    
    // Clear search criteria so they don't interfere with future refreshes
    setSearchFirst('');
    setSearchLast('');
    
    // Clear search input fields for same reason
    Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
    );
    
    
    await fetchState(`${serverURL}/api/simpleQuery?query=` + simpleQuery, setIsLoaded, setBookings, setError);
  }
  
  // Get Owners for select Owner
  async function getOwners() {
    
    fetch(`${serverURL}/api/getReport?tables=Owners`)
        .then(res => res.json()).then(res => {
      res.map((owner) => {owner.name = owner.firstName + " " + owner.lastName});
      setSelectedOwnerId(res[0].ownerId || '');
      return setOwners(res);
    });
  }
  
  // Get an Owner's Pets
  async function getPets(row) {
    console.log("getting pets");
    
    fetch(`${serverURL}/api/ownerPets/${row.ownerEmail}`) // todo: change this to id
        .then(res => res.json()).then(res => {
      setSelectedPetId(row.petId || '');
      return setUserPets(res);
    });
  }
  
  // Get an rooms available for check-in
  async function getAvailableRooms() {
    let simpleQuery = "select `roomId` from `Rooms` where `roomId` not in  " +
        "(select roomId from Bookings natural join `Rooms`)"
    console.log("In getAvailableRooms", simpleQuery)
    
    await fetchState(`${serverURL}/api/simpleQuery?query=` + simpleQuery, setIsLoaded, setAvailableRooms, setError)
    // .then(res => res.json()).then(res => {
    console.log("AVAILABLE ROOMS = ", availableRooms)
    // });
  }
  
  // add / update booking    TODO: need an owner selector
  async function makeReservation() {
    let url = serverURL + `/api/bookings`;
    let response;
    const data = {
      startDate: startDate,
      endDate: endDate,
      ownerId: ownerId,
      petId: selectedPetId,
      roomId: selectedRoomId
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
      url = serverURL + `/api/reservations`;
      response = await postState(url, data);
    }
    let body = await response.json();
    console.log('made booking. Got response', body);
    await refreshBookings(filterBy);
  }

  // Delete a Booking
  async function deleteReservation(row) {
    
    let result = await fetch(`${serverURL}/api/reservations/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    
    await refreshBookings(filterBy);
  }
 
  // Check in guest   TODO: need check out
  async function checkIn() {
    const url = serverURL + `/api/bookings`;
    let response;
    console.log("here again: ", selectedPetId, typeof selectedPetId, selectedRoomId, typeof selectedRoomId)
    let roomId = parseInt(selectedRoomId);
    const data = {
      startDate: startDate,
      endDate: endDate,
      ownerId: ownerId,
      petId: selectedPetId,
      bookingId: bookingId,
      roomId: roomId
    };
    
    
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    let body = await response.json();
    console.log('checked in. Got response', body);
    setFilterBy("all");
    await refreshBookings(filterBy);
  }
  
  
  // --------- Set modal properties and other ----------------------------------
  
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row) {
    console.log("update row = ", row);
    getPets(row);
    setUpdateMode(true);
    setBookingId(row.bookingId);
    setOwnerId(row.ownerId);
    setOwnerName(row.ownerName);
    setSelectedRoomId(row.roomId);
    // setOwnerEmail(row.email);   can eliminate? TODO
    setStartDate(row.startDate);
    setEndDate(row.endDate);
    setModalVisible(true);
  }
  
  // initialize check in modal after clicking row's checkin button
  // async function makeCheckInModal(row) {
  //   await getAvailableRooms();
  //   setCheckInMode(true);
  //   setModalVisible(true);
  //   setBookingId(row.bookingId);
  //   setSelectedRoomId(row.roomId);
  //   setSelectedPetId(row.petId);
  //   setOwnerId(row.ownerId);
  //   setOwnerName(row.ownerName);
  //   setStartDate(row.startDate);
  //   setEndDate(row.endDate);
  // }
  
  // initialize the new Select Owner modal after clicking 'New Reservation' button
  function makeSelectOwnerModal() {
    getOwners();
    setModalProps({type: 'select-owner'})
    setModalVisible(true);
  }
  
  // initialize the new Reservation modal after clicking 'New Reservation' button
  function makeNewReservationModal() {
    setModalVisible(true);
    setModalProps({type: 'new-reservation'});
    let selected_owner = owners.filter((owner) => owner.ownerId === parseInt(ownerId))
    console.log("Tucker says: ", selected_owner, selected_owner.email)
    selected_owner.ownerEmail = selected_owner["email"];
    console.log("selected_owner = ", selected_owner)
    setOwnerName(selected_owner.name);
    getPets(selected_owner);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row) {
    console.log("row = ", row)
    setBookingId(row.bookingId);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }
  
  // initialize check in modal after clicking row's checkin button
  async function makeCheckInModal(row) {
    await getAvailableRooms();
    setCheckInMode(true);
    setModalVisible(true);
    setBookingId(row.bookingId);
    setSelectedRoomId(row.roomId);
    setSelectedPetId(row.petId);
    setOwnerId(row.ownerId);
    setOwnerName(row.ownerName);
    setStartDate(row.startDate);
    setEndDate(row.endDate);
  }
  
  // Set ShowReport headers and attributes
  const headers = {
    bookingId: "Booking Id",
    ownerName: "Owner",
    petName: "Pet",
    startDate: "Start Date",
    endDate: "End Date",
    roomId: "Room",
  };
  const attributes = Object.keys(headers);
  
  
  // -------- Render page ------------------------------------------------------
  
  return (
      <div>
        <Container>
          <h1 className={"mt-4 mb-3"}>Manage Bookings</h1>
        </Container>
        
        {/*        Header Selections        */}
        <Container>
          <Button
              className={"mb-3 mt-1 mr-5 shadow"}
              variant="success"
              onClick={() => {makeSelectOwnerModal();}}
          >
            Add New Reservation
          </Button>
          
          {/*  Filter by today or tomorrow */}
          <span className={"lead font-weight-bold mb-3 mr-2"}>
            Filter List:
          </span>
          <FilterRadioButton setFilterBy={setFilterBy}
                             refresh={refreshBookings}
                             filterBy={filterBy}
          />
  
          {/*        Filter by owner       */}
          <div>
            <Form className={"border rounded p-3"}
                  onSubmit={e => {
                    e.preventDefault();
                    return refreshBookings(filterBy, searchFirst, searchLast);
                  }}>
              <label>
                Search for bookings by owner
              </label>
              <Row>
                <Col>
                  <Form.Control type="text"
                                id={"search-first-name"}
                                placeholder="First Name"
                                onChange={e => setSearchFirst(e.target.value)}/>
                  <Form.Text className="text-muted">
                    Search by first or last name, or both, using full name or starting letters
                  </Form.Text>
                </Col>
                <Col>
                  <Form.Control type="text"
                                placeholder="Last Name"
                                onChange={e => setSearchLast(e.target.value)}/>
                </Col>
              </Row>
              <Button variant="info" type="submit">
                Search Bookings
              </Button>
              <Button variant="secondary"
                      className={"ml-5"}
                      onClick={() => refreshBookings(filterBy)}>
                Clear Search - Show All
              </Button>
            </Form>
          </div>
          
          {/* ---------- Modal ---------- */}
          <GenericModal
              title={(checkInMode) ? 'Check in Reservation' :
                  ((updateMode) ? 'Update a Reservation' : 'Make a Reservation')}
              visible={modalVisible}
              setVisible={setModalVisible}
              action={ () => {
                if (checkInMode) {
                  checkIn()
                }
                else if (modalProps.type === 'new-reservation') {makeReservation(ownerId)}
                else if (modalProps.type === 'select-owner') {makeNewReservationModal()}
              }}
          >
            <p className={"bookings-modal"}>
              {(updateMode) ? 'Reservation ID# ' + bookingId + ' for ' + ownerName : ''}
            </p>
            <p className={"bookings-modal"}>
              {(checkInMode) ? 'Reservation ID# ' + bookingId + ' for ' + ownerName : ''}
            </p>
            <p className={"bookings-modal"}>
              {(modalProps.type === 'new-reservation') ?
                  'For ' + ownerName + ' (owner ID # ' + ownerId + ')'
              : ''
              }
            </p>

              {modalProps.type === 'select-owner' &&
                <Select
                id="select-an-owner"
                label="Select an Owner"
                name="owner"
                value={ownerId}
                setValue={setOwnerId}
                optionsList={owners}
                optionKey="ownerId"
                optionValue="name"
                />}

              {checkInMode ?
                <Select
                    id="select-a-room"
                    label="Select room for check in"
                    name="room"
                    value={selectedRoomId}
                    setValue={setSelectedRoomId}
                    optionsList={availableRooms}
                    optionKey="roomId"
                    optionValue="roomId"
                /> : ''
            }
            
            {checkInMode || modalProps.type === 'select-owner' ? '' :
                <Select
                    id="select-a-pet"
                    label="Select a pet"
                    name="pet"
                    value={selectedPetId}
                    setValue={setSelectedPetId}
                    optionsList={userPets}
                    optionKey="petId"
                    optionValue="name"
                />}
            
            {checkInMode || modalProps.type === 'select-owner' ? '' :
                <Date
                    id="start-date"
                    label="Checkin Date"
                    name="start-date"
                    value={startDate} // todo: couple this with data that actually gets sent
                    setValue={setStartDate}
                />}
            
            {checkInMode || modalProps.type === 'select-owner' ? '' :
                <Date
                    id="end-date"
                    label="Checkout Date"
                    name="end-date"
                    value={endDate} // todo: couple this with data that actually gets sent
                    setValue={setEndDate}
                />}
          </GenericModal>
          
          <GenericModal
              title={`Are you sure you want to delete booking ${bookingId}?`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              action={deleteReservation}
          />
        
        </Container>
        
        <Container> // Bookings list display
          
          <h4 className={"mt-5"}>Bookings:</h4>
          <ShowReport title="Bookings"
                      headers={headers}
                      attributes={attributes}
                      report_rows={bookings}
                      onUpdate={makeUpdateModal}
                      onDelete={confirmDelete}
                      onCheckIn={makeCheckInModal}/>
        
        </Container>
      
      </div>
  );
}

export default Bookings;
