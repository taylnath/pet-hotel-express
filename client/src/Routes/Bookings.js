import {Container, Button, Form, Row, Col} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from "../Components/Reports/ShowReport";
import {today, tomorrow} from '../Helpers/dateHelpers';
import Input from "../Components/Forms/Input";
import FilterRadioButton from "../Components/Forms/FilterRadioButton";
import GenericModal from "../Components/GenericModal";
import ConfirmDelete from "../Components/Modals/ConfirmDelete";
import Select from '../Components/Forms/Select';
import Date from '../Components/Forms/Date';
import { getBookings, queryAvailableRooms } from "../Helpers/simpleQueries";
import formEndDateHelper from "../Helpers/formEndDateHelper";

// Bookings
//page for managers to manage Bookings


function Bookings(props) {
  // -------- state --------
  // loading status
  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    error: false
  });
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [checkInMode, setCheckInMode] = useState(false);
  const [checkOutMode, setCheckOutMode] = useState(false);
  
  // user, data states
  const [modalProps, setModalProps] = useState({type: '', title: ''});
  const [filterBy, setFilterBy] = useState('all');
  const [owners, setOwners] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');   // can eliminate? TODO
  const [ownerId, setOwnerId] = useState('');
  const [ownerName, setOwnerName] = useState('')
  const [userPets, setUserPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [petName, setPetName] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [bookingId, setBookingId] = useState('');
  const [searchFirst, setSearchFirst] = useState('');
  const [searchLast, setSearchLast] = useState('');
  const [bookings, setBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  
  
  // -------- Effects ----------------------------------------------------------
  
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setModalProps({type: '', title: ''})
      setCheckInMode(false);
      setCheckOutMode(false);
      setSelectedOwnerId('');
      setOwnerId('');
      setOwnerName('');
      setSelectedRoomId('');
      setSelectedPetId('');
      setPetName('');
      setStartDate(today);
      setEndDate(tomorrow);
      setBookingId('');
      setEmployeeId('');
    }
  }, [modalVisible])
 
  useEffect(() => refreshBookings(filterBy), []);
  
  
  // -------- Actions ----------------------------------------------------------
  
  // ----- Helper Functions -----
  
  // Refresh ShowReport
  async function refreshBookings(filter) {
    
    // Set * filter * 'where' conditions, or set to 1
    //    (so subsequent wheres start with 'and')
    let where = " where 1 ";
    if (!(filter === 'all')) {
      filter === 'today' ?
          where = " where `Bookings`.`startDate` = " + `'${today}' ` :
          where = " where `Bookings`.`startDate` = " + `'${tomorrow}' `
    }
    // Set * search * 'where' conditions, if any
    if (searchFirst) {
      where += " and `Owners`.`firstName` like '" + `${searchFirst}` + escape('%') + "' "
    }
    if (searchLast) {
      where += " and `Owners`.`lastName` like '" + `${searchLast}` + escape('%') + "' "
    }
    
    let simpleQuery = getBookings + where + ";"
    
    // Clear search & input fields so not to interfere with future refreshes
    setSearchFirst('');
    setSearchLast('');
    Array.from(document.querySelectorAll("input")).forEach(
        input => (input.value = "")
    );
    
    await getState(`/api/simpleQuery?query=` + simpleQuery, setBookings, setLoadingStatus);
    console.log("bookings = ", bookings);
  }
  
  // Get Owners for select Owner
  async function getOwners() {
    getState(`/api/dynamic?tables=Owners`, () => {}, setLoadingStatus)
      .then(res => {
        res.map((owner) => {owner.name = owner.firstName + " " + owner.lastName});
        setOwnerId(res[0].ownerId || '');
        return setOwners(res);
    });
  }
  
  // Get an Owner's Pets
  async function getPets(row) {
    // todo: was this refactored correctly?
    getState(`/api/ownerPets/${row.ownerEmail}`, setUserPets, setLoadingStatus) // todo: change this to id
      .then(res => {
        setSelectedPetId(res.length ? row.petId || res[0].petId : '');
    });
  }
  
  // Get an rooms available for check-in
  async function getAvailableRooms() {
    let url = "/api/simpleQuery?query="
   
    getState(url + queryAvailableRooms, setAvailableRooms, setLoadingStatus)
      .then(res => setSelectedRoomId(res[0] ? res[0].roomId : ''));
  }
  
  // add / update booking    TODO: need an owner selector
  async function makeReservation() {
    let url = `/api/bookings`;
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
      data.employeeId = employeeId;
      response = await putState(url, data, setLoadingStatus);
    } else {
      // TODO: combine /api/reservations and /api/bookings
      url = `/api/reservations`;
      response = await postState(url, data, setLoadingStatus);
    }
    let body = await response.json();
    await refreshBookings(filterBy);
  }

  // Delete a Booking
  async function deleteReservation(row) {
    await deleteState(`/api/reservations/${bookingId}`, setLoadingStatus);
    await refreshBookings(filterBy);
  }
 
  // Check in guest
  async function checkIn() {
    const url = `/api/bookings`;
    let response;
    let room_id;
    checkOutMode ? room_id = null : room_id = selectedRoomId;
    
    const data = {
      startDate: startDate,
      endDate: endDate,
      ownerId: ownerId,
      petId: selectedPetId,
      bookingId: bookingId,
      roomId: room_id,
      employeeId: employeeId
    };
    
    response = await putState(url, data, setLoadingStatus);
    
    let body = await response.json();
    // setFilterBy("all");
    await refreshBookings(filterBy);
  }
  
  
  // --------- Set modal properties and other ----------------------------------
  
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row) {
    modalProps.title = "Update Reservation"
    getPets(row);
    setUpdateMode(true);
    setBookingId(row.bookingId);
    setOwnerId(row.ownerId);
    setOwnerName(row.ownerName);
    setSelectedRoomId(row.roomId);
    // setOwnerEmail(row.email);   can eliminate? TODO
    setStartDate(row.startDate);
    setEndDate(row.endDate);
    setEmployeeId(row.employeeId);
    setModalVisible(true);
  }
  
  // initialize the new Select Owner modal after clicking 'New Reservation' button
  function makeSelectOwnerModal() {
    getOwners();
    modalProps.type = 'select-owner';
    modalProps.title = 'New Reservation'
    setModalVisible(true);
  }
  
  // initialize the new Reservation modal after clicking 'New Reservation' button
  function makeNewReservationModal() {
    setModalVisible(true);
    modalProps.type = 'new-reservation';
    let selected_owner = owners.filter((owner) => owner.ownerId === parseInt(ownerId))
    selected_owner[0].ownerEmail = selected_owner[0].email;
    setOwnerName(selected_owner[0].name);
    getPets(selected_owner[0]);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row) {
    setBookingId(row.bookingId);
    setConfirmDeleteVisible(true);
  }
  
  function setEndDateMin (formStartDate) {
    setStartDate(formStartDate);
    let endDateMin = formEndDateHelper(formStartDate);
    document.getElementById("end-date").setAttribute("min", endDateMin);
    setEndDate(endDateMin);
  }
  
  // initialize check in modal after clicking row's checkin button
  async function makeCheckInModal(row) {
    if (row.roomId) {
      modalProps.title = ""
      setCheckOutMode(true);
      setCheckInMode(false);
      setSelectedRoomId(row.roomId);
      setEmployeeId(row.employeeId)
    } else {
      modalProps.title = ""
      setCheckInMode(true);
      setCheckOutMode(false);
      setEmployeeId(props.user.id);
      await getAvailableRooms();
    }
    setModalVisible(true);
    setBookingId(row.bookingId);
    // setSelectedRoomId(row.roomId);
    setPetName(row.petName);
    setSelectedPetId(row.petId);
    setOwnerId(row.ownerId);
    setOwnerName(row.ownerName);
    setStartDate(row.startDate);
    setEndDate(row.endDate);
  }
  
  // Set ShowReport headers and attributes
  const headers = {
    bookingId: "ID",
    ownerName: "Owner",
    petName: "Pet",
    startDate: "Start Date",
    endDate: "End Date",
    empName: "Employee",
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
                    Search by first or last name, or both, using full name or
                    starting letters
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
              title={modalProps.title}
              visible={modalVisible}
              setVisible={setModalVisible}
              action={ () => {
                if (checkInMode || checkOutMode) {
                  checkIn()
                } else if (modalProps.type === 'new-reservation' || updateMode) {
                  makeReservation(ownerId)
                } else if (modalProps.type === 'select-owner') {
                  makeNewReservationModal()
                }
              }}
          >
            <p className={"modal-subtitle"}>
              {(updateMode) ? 'Reservation ID# ' + bookingId + ' for ' + ownerName : ''}
            </p>
            <p className={"modal-subtitle"}>
              {(checkInMode) ?
                  'Check in ' + petName + ' for ' + ownerName + ' (Booking ID '
                  + bookingId + ')' : ''}
            </p>
            <p className={"modal-subtitle"}>
              {(checkOutMode) ?
                  'Check out ' + petName + ' from Room ' + selectedRoomId : ''}
            </p>
            <p className={"modal-subtitle"}>
              {(modalProps.type === 'new-reservation') ?
                  'For ' + ownerName + ' (owner ID # ' + ownerId + ')'
              : ''
              }
            </p>
            <p className={"modal-subtitle"}>
              {(modalProps.type === 'select-owner') ?
                  'Select an owner for this reservation'
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
            
            {checkInMode || checkOutMode || modalProps.type === 'select-owner' ? '' :
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
            
            {checkInMode || checkOutMode || modalProps.type === 'select-owner' ? '' :
                <Date
                    id="start-date"
                    label="Checkin Date"
                    name="start-date"
                    value={startDate} // todo: couple this with data that actually gets sent
                    setValue={setEndDateMin}
                />}
            
            {checkInMode || checkOutMode || modalProps.type === 'select-owner' ? '' :
                <Date
                    id="end-date"
                    label="Checkout Date"
                    name="end-date"
                    value={endDate} // todo: couple this with data that actually gets sent
                    setValue={setEndDate}
                />}
          </GenericModal>
          
          <ConfirmDelete
              title={'Delete Booking'}
              deleteText={`booking ${bookingId}?`}
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
                      onCheckIn={makeCheckInModal}
                      isLoading={loadingStatus}
          />
        
        </Container>
      
      </div>
  );
}

export default Bookings;
