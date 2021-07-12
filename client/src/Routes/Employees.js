import {Container, Button} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/ShowReport";
import Input from "../Components/Forms/Input";
import EmployeeModal from "../Components/EmployeeModal";
import GenericModal from "../Components/GenericModal";
const serverURL = settings.serverURL;

// Employyees
//page for managers to manage Employees


function Employees() {
  // --- state ---
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // user, data states
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobType, setJobType] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  // --- effects ---
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setFirstName('');
      setLastName('');
      setJobType('');
    }
  }, [modalVisible])
  
  // TODO: Do I need to refresh employee list?  If so, look at Reservations
  
  // --- actions ---
  // add / update employee
  
  async function updateEmployee() {
    const url = serverURL + '/api/employees';
    let response;
    const data = {
      firstName: firstName,
      lastName: lastName,
      jobType: jobType
    };
    if (updateMode) {
      data.employeeId = employeeId;
      response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
      });
    } else {
      response = await postState(url, data);
    }
    let body = await response.json();
    console.log('Employee updated. Got response', body);
  }
  
  async function deleteEmployee(row){
    let result = await fetch(`${serverURL}/api/employees/${row.employeeId}`, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json'}
        }).then(res => res.json());
    console.log(result)
    // await refreshEmployees  TODO ?
  }
  
  // initialize the update modal after clicking on a row's update button
  function makeUpdateModal(row){
    setUpdateMode(true);
    setEmployeeId(row.employeeId);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setModalVisible(true);
    console.log('updating row:', row);
  }
  
  // prepare for ShowReports
  const headers = {
    employeeId: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    jobTitle: "Job Title"
  }
  const attributes = ["employeeId", "firstName", "lastName", "jobTitle"]
 
  useEffect(() => {
    fetchState(`${serverURL}/api/getReport?tables=Employees`, setIsLoaded, setEmployees, setError);
  }, []);
  
  return (
      <div>
        <Container>
        <h1 className={"mt-5 mb-3"}>Employees</h1>
        </Container>
        <Container>
          <GenericModal
              title={(updateMode)? 'Update Employee' : 'Add an Employee'}
              visible={modalVisible}
              setVisible={setModalVisible}
              action={updateEmployee()}
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
                setValue={setFirstName}
            />
            <Input
                id="job-type"
                label="Job Type"
                name="job-type"
                value={jobType}
                setValue={setJobType}
            />
          </GenericModal>
          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Employee
          </Button>
        </Container>
        
        <Container>
  
          <h4 className={"mt-5"}>Employee List:</h4>
          <ShowReport title="Employee List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={employees}
                      onUpdate={updateEmployee()}
                      onDelete={deleteEmployee}/>

        </Container>

      </div>
  );
}

export default Employees;


// <h4>Add New Employee:</h4>
// <EmployeeModal
//     title={"Add Employee"}
//     visible={showModal}
//     setVisible={setShowModal}
//     action={onAdd}
//     children={<AddChildren />}
// />