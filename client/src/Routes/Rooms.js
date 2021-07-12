import {Container, Button} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
const serverURL = settings.serverURL;

// Rooms
//page for managers to manage Rooms


function Rooms() {
  // --- state ---
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // user, data states
  const [rooms, setRooms] = useState([]);
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');
  
  // --- effects ---
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setDescription('');
    }
  }, [modalVisible])
  
  async function refreshRooms() {
    console.log("in Refresh rooms");     // TODO
    await fetchState(`${serverURL}/api/getReport?tables=Rooms`, setIsLoaded, setRooms, setError);
  }
  
  // --- actions ---
  // add / update room
  
  async function updateRoom() {
    const url = serverURL + '/api/rooms';
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
  
  async function deleteRoom(row){
    let result = await fetch(`${serverURL}/api/rooms/${row.roomId}`, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json'}
    }).then(res => res.json());
    console.log(result)
    await refreshRooms()
  }
  
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    console.log("row = ", row)
    setUpdateMode(true);
    setRoomId(row.roomId);
    setDescription(row.description);
    setModalVisible(true);
    console.log('updating row:', row);
  }
  
  // prepare for ShowReports
  const headers = {
    roomId: "Id",
    description: "Description"
  }
  const attributes = ["roomId", "description"]
  
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
            <Input
                id="description"
                label="Description"
                name="description"
                value={description}
                setValue={setDescription}
            />
          </GenericModal>
        </Container>
        
        <Container>
          
          <h4 className={"mt-5"}>Room List:</h4>
          <ShowReport title="Room List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={rooms}
                      onUpdate={makeUpdateModal}
                      onDelete={deleteRoom}/>
        
        </Container>
      
      </div>
  );
}

export default Rooms;
