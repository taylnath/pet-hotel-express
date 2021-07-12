function Input(props){
  return (
      <>
        <label htmlFor={props.id} className="col-form-label">
          {props.label}
        </label>
        <input
            name={props.name}
            id={props.id}
            className="form-control"
            type="text"
            value={props.value}
            onChange={e=> props.setValue(e.target.value)}
        />
      </>
  )
}

export default Input;