import {Container, Button} from "react-bootstrap";
import settings from "../appSettings";
import {useEffect, useState} from "react";
import fetchState from "../DataAccess/fetchState";
import postState from "../DataAccess/postState";
import ShowReport from "../Components/ShowReport";
import Input from "../Components/Forms/Input";
import GenericModal from "../Components/GenericModal";
const serverURL = settings.serverURL;

// Employees
//page for managers to manage Employees


function Employees() {
  // --- state ---
  // loading state
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // modal state
  const [updateMode, setUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // user, data states
  const [employees, setEmployees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  // --- effects ---
  // reset modal data when it closes
  useEffect(() => {
    if (!modalVisible) {
      setUpdateMode(false);
      setFirstName('');
      setLastName('');
      setJobTitle('');
    }
  }, [modalVisible])
  
  async function refreshEmployees() {
    fetchState(`${serverURL}/api/getReport?tables=Employees`, setIsLoaded, setEmployees, setError);
  }
  
  // --- actions ---
  // add / update employee

  async function updateEmployee() {
    const url = serverURL + '/api/employees';
    let response;
    const data = {
      firstName: firstName,
      lastName: lastName,
      jobTitle: jobTitle
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
    await refreshEmployees()
  }
  
  async function deleteEmployee(row){
    let result = await fetch(`${serverURL}/api/employees/${row.employeeId}`, {
      method: 'DELETE',
      headers: {'Content-type': 'application/json'}
        }).then(res => res.json());
    console.log(result)
    await refreshEmployees()
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
  
  // prepare for ShowReports
  const headers = {
    employeeId: "Id",
    firstName: "First Name",
    lastName: "Last Name",
    jobTitle: "Job Title"
  }
  const attributes = ["employeeId", "firstName", "lastName", "jobTitle"]
 
  useEffect(() => {refreshEmployees()}, []);
  
  return (
      <div>
        <Container>
        <h1 className={"mt-5 mb-3"}>Employees</h1>
        </Container>
        
        <Container>
          <Button variant="success" onClick={() => {setModalVisible(true);}}>
            Add New Employee
          </Button>
          
          <GenericModal
              title={(updateMode)? 'Update Employee' : 'Add an Employee'}
              visible={modalVisible}
              setVisible={setModalVisible}
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
        </Container>
        
        <Container>
  
          <h4 className={"mt-5"}>Employee List:</h4>
          <ShowReport title="Employee List"
                      headers={headers}
                      attributes={attributes}
                      report_rows={employees}
                      onUpdate={makeUpdateModal}
                      onDelete={deleteEmployee}/>

        </Container>

      </div>
  );
}

export default Employees;
