import {Container, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
import {getPetsRooms} from "../Helpers/simpleQueries";
import LoadingStatus from "../Components/LoadingStatus";

// Rooms
//page for managers to manage Rooms


function Rooms() {
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
  
  // user, data states
  const [rooms, setRooms] = useState([]);
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState('');
  const [petName, setPetName] = useState('');
  const [modalProps, setModalProps] = useState({})
  
  // -------- effects --------
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible && !confirmDeleteVisible) {
      setUpdateMode(false);
      setPetName('');
      setDescription('');
      setRoomId('');
      setModalProps({});
      loadingStatus.cancelled ?
          setLoadingStatus({loading: false, error: false}) :
          setLoadingStatus({loading: true, error: false});
    }
  }, [modalVisible, confirmDeleteVisible])
  
  
  useEffect(() => refreshRooms().then(console.log("done!")), []);
  
  async function refreshRooms() {
    let url = '/api/simpleQuery'
    await getState(url + `?query=` + getPetsRooms, setRooms, setLoadingStatus);
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
      response = await putState(url, data, setLoadingStatus);
    } else {
      response = await postState(url, data, setLoadingStatus);
    }
    let body = await response;
    console.log('Room updated. Got response', body);
    await refreshRooms()
  }
  
  async function deleteRoom(){
    let result = await deleteState(`/api/rooms/${roomId}`, setLoadingStatus);
    setRoomId('');
    await refreshRooms()
  }
  
  // -------- ShowReport Interactions --------
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    setUpdateMode(true);
    setModalProps({subtitle: `Update room ${row.roomId}`})
    setRoomId(row.roomId);
    setDescription(row.description);
    setModalVisible(true);
  }
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    setRoomId(row.roomId);
    setConfirmDeleteVisible(true);
  }
  
  // report headers
  const headers = {
    roomId: "Id",
    description: "Description",
    petName: "Pet Guest"
  }
  const attributes = ["roomId", "description", "petName"]

  // render page
  return (
      <div>
        <Container>
          <h1 className={"mt-5 mb-3"}>Rooms</h1>
        </Container>
        
        <Container>
          
          <Button variant="success shadow"
                  onClick={() => {setModalVisible(true);}}>
            Add New Room
          </Button>
  
          <LoadingStatus status={loadingStatus}/>
          
          <GenericModal
              title={(updateMode)? 'Update Room' : 'Add a Room'}
              visible={modalVisible}
              setVisible={setModalVisible}
              setLoadingStatus={setLoadingStatus}
              action={updateRoom}
          >
            <p className={"modal-subtitle"}> {modalProps.subtitle} </p>
            
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
              setLoadingStatus={setLoadingStatus}
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
