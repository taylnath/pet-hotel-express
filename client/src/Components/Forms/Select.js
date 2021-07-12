
function Select(props){

  return (
    <>
      <label htmlFor="form-select" className="col-form-label">
        {props.label}
      </label>
      <select 
        className="form-control"
        name={props.name} 
        id="form-select" 
        value={props.value} 
        onChange={e => {
          console.log(`${props.name} target value is`, e.target.value); {/* debug */}
          props.setValue(e.target.value);
        }
      }>
        {props.valueObject.map(obj => 
          <option key={obj.key} value={obj.key}>
            {obj.value}
          </option>)}
      </select>
    </>
  )
}

export default Select;