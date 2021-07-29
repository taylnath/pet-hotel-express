
// Generic Date form field for use in GenericModal

// props:
//    id: id of the field (could probably take this out)
//    label
//    name: name of the field
//    value: state variable the value gets tied to
//    setValue

function Date(props){
  return (
    <>
      <label htmlFor={props.id} className="col-form-label">
        {props.label}
      </label>
      <input
        name={props.name}
        id={props.id}
        className="form-control"
        type="date"
        value={props.value}
        onChange={e=> props.setValue(e.target.value)}
        min={props.min}
      />
    </>
  )
}

export default Date;