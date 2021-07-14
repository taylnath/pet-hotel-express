
// Generic Select form field for use in GenericModal

// props:
//    id: id of the field (could probably take this out)
//    label
//    name: name of the field
//    value: state variable the value gets tied to
//    setValue
//    optionsList: list of available options. Assumes this is a list of javascript objects.
//    optionKey: string key to associate to each option i.e. 'id'
//    optionValue: string key to associate to each option value i.e. 'name'

function Select(props){
  console.log("options passed to select:", props.optionsList);

  return (
    <>
      <label htmlFor={props.id} className="col-form-label">
        {props.label}
      </label>
      <select 
        className="form-control"
        name={props.name} 
        id={props.id} 
        value={props.value} 
        onChange={e => {
          console.log(`${props.name} target value is`, e.target.value); {/* debug */}
          props.setValue(e.target.value);
        }
      }>
        {props.optionsList.map(obj => 
          <option key={obj[props.optionKey]} value={obj[props.optionKey]}>
            {obj[props.optionValue]}
          </option>)}
      </select>
    </>
  )
}

export default Select;