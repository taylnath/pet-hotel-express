function Employees(props) {
  fetch(`${serverURL}/api/ownerPets/${props.user.email}`).then(res => res.json()).then(res => console.log(res))
  return (

      <h1>Employees</h1>
  );
}

export default Employees;