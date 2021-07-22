import {Container, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";

// Rooms
//page for managers to manage Rooms


function Rooms() {
  // -------- state --------
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // user, data states
  const [rooms, setRooms] = useState([]);
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');
  const [petName, setPetName] = useState('');
  const [modalProps, setModalProps] = useState({})
  
  // -------- effects --------
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setPetName('');
      setDescription('');
      setRoomId('');
      setModalProps({})
    }
  }, [modalVisible])
  
  async function refreshRooms() {
    console.log("in Refresh rooms");     // TODO
    let url = '/api/simpleQuery'
    let simpleQuery = "select `Rooms`.`roomId` as roomId, `Rooms`.`description` " +
        "as description, `Pets`.`name` as petName from `Rooms` left join" +
        " `Bookings` on `Rooms`.`roomId` = `Bookings`.`roomId` left join " +
        "`Pets` on `Pets`.`petId` = `Bookings`.`petId`;"
  
    await fetchState(`/api/simpleQuery?query=` + simpleQuery, setIsLoaded, setRooms, setError);

    // let response;
    // const data = {simpleQuery: simpleQuery};
    // response = await postState(url, data);
    // let body = await response.json()
    // console.log('Rooms Refreshed.  Got response', body)
    
    // await fetchState(`/api/dynamic?tables=Rooms`, setIsLoaded, setRooms, setError);
  }
  
  // -------- actions --------
  // add / update room
  
  async function updateRoom() {
    const url = '/api/rooms';
    let response;
    const data = {
      description: description
    };
    if (updateMode) {
      data.roomId = roomId;
      response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
      });
    } else {
      response = await postState(url, data);
    }
    let body = await response.json();
    console.log('Room updated. Got response', body);
    await refreshRooms()
  }
  
  async function deleteRoom(){
    let result = await fetch(`/api/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json'}
    }).then(res => res.json());
    console.log(result);
    setRoomId('');
    await refreshRooms()
  }
  
  // -------- ShowReport Interactions --------
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    console.log("row = ", row)
    setUpdateMode(true);
    setModalProps({subtitle: `Update room ${row.roomId}`})
    setRoomId(row.roomId);
    setDescription(row.description);
    setModalVisible(true);
    console.log('updating row:', row);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    console.log("row = ", row)
    setRoomId(row.roomId);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }
  
  // report headers
  const headers = {
    roomId: "Id",
    description: "Description",
    petName: "Pet Guest"
  }
  const attributes = ["roomId", "description", "petName"]
  
  useEffect(() => refreshRooms().then(console.log("done!")), []);

  return (
      <div>
        <Container>
          <h1 className={"mt-5 mb-3"}>Rooms</h1>
        </Container>
        
        <Container>
          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Room
          </Button>
          
          <GenericModal
              title={(updateMode)? 'Update Room' : 'Add a Room'}
              visible={modalVisible}
              setVisible={setModalVisible}
              action={updateRoom}
          >
            <p className={"bookings-modal"}>
              {modalProps.subtitle}
            </p>
            <Input
                id="description"
                label="Description"
                name="description"
                value={description}
                setValue={setDescription}
            />
          </GenericModal>
  
          <GenericModal
              title={`Are you sure you want to delete room ${roomId}?`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              action={deleteRoom}
          />
          
        </Container>
        
        <Container>
          
          <h4 className={"mt-5"}>Room List:</h4>
          <ShowReport title="Room List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={rooms}
                      onUpdate={makeUpdateModal}
                      onDelete={confirmDelete}/>
        
        </Container>
      
      </div>
  );
}

export default Rooms;
