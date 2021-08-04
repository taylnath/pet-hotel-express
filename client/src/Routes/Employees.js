import {Container, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import ShowReport from "../Components/Reports/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
import LoadingStatus from "../Components/LoadingStatus";

// Employees
//page for managers to manage Employees


function Employees() {
  // --- state ---
  // loading state
  const [loadingStatus, setLoadingStatus] = useState({
    loading: false,
    error: false
  });
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  
  // user, data states
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  // --- effects ---
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible && !confirmDeleteVisible) {
      setUpdateMode(false);
      setFirstName('');
      setLastName('');
      setJobTitle('');
      setEmployeeId('');
      loadingStatus.cancelled ?
          setLoadingStatus({loading: false, error: false}) :
          setLoadingStatus({loading: true, error: false});
    }
  }, [modalVisible, confirmDeleteVisible])
  
  async function refreshEmployees() {
    getState(`/api/dynamic?tables=Employees`, setEmployees, setLoadingStatus);
  }
  
  // --- actions ---
  // add / update employee

  async function updateEmployee() {
    const url = '/api/employees';
    let response;
    const data = {
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle
    };
    if (updateMode) {
      data.employeeId = employeeId;
      response = await putState(url, data, setLoadingStatus);
    } else {
      response = await postState(url, data, setLoadingStatus);
    }
    let body = await response;
    console.log('Employee updated. Got response', body);
    await refreshEmployees()
  }
  
  async function deleteEmployee(){
    let result = deleteState(`/api/employees/${employeeId}`, setLoadingStatus);
    // setEmployeeId(''); // I don't think these are necessary, but I don't think they hurt either
    // setFirstName('');
    // setLastName('');
    console.log(result);
    await refreshEmployees(); // does this need to be awaited? I'm not sure either way
  }
  
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    console.log("row = ", row)
    setUpdateMode(true);
    setEmployeeId(row.employeeId);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setJobTitle(row.jobTitle)
    setModalVisible(true);
    console.log('updating row:', row);
  }
  
  
  // initialize the confirm delete modal after clicking on a row's delete button
  function confirmDelete(row){
    console.log("row = ", row)
    setEmployeeId(row.employeeId);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setConfirmDeleteVisible(true);
    console.log('deleting row:', row);
  }
  
  // prepare for ShowReports
  const headers = {
    employeeId: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    jobTitle: "Job Title"
  }
  const attributes = ["employeeId", "firstName", "lastName", "jobTitle"]
 
  useEffect(() => refreshEmployees(), []);
  
  return (
      <div>
        <Container>
        <h1 className={"mt-5 mb-3"}>Employees</h1>
        </Container>
        
        <Container>
          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Employee
          </Button>
  
          <LoadingStatus status={loadingStatus}/>
          
          <GenericModal
              title={(updateMode)? 'Update Employee' : 'Add an Employee'}
              visible={modalVisible}
              setVisible={setModalVisible}
              setLoadingStatus={setLoadingStatus}
              action={updateEmployee}
          >
            <Input
                id="first-name"
                label="First Name"
                name="first-name"
                value={firstName}
                setValue={setFirstName}
            />
            <Input
                id="last-name"
                label="Last Name"
                name="last-name"
                value={lastName}
                setValue={setLastName}
            />
            <Input
                id="job-title"
                label="Job Title"
                name="job-title"
                value={jobTitle}
                setValue={setJobTitle}
            />
          </GenericModal>
  
          <GenericModal
              title={`Are you sure you want to delete ${firstName} ${lastName}?`}
              visible={confirmDeleteVisible}
              setVisible={setConfirmDeleteVisible}
              setLoadingStatus={setLoadingStatus}
              action={deleteEmployee}
          />
          
        </Container>
        
        <Container>
  
          <h4 className={"mt-5"}>Employee List:</h4>
          <ShowReport title="Employee List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={employees}
                      onUpdate={makeUpdateModal}
                      onDelete={confirmDelete}/>

        </Container>

      </div>
  );
}

export default Employees;
