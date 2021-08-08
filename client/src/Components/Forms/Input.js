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
            type={props.type || "text"}
            value={props.value}
            onChange={e=> props.setValue(e.target.value)}
            required={props.required}
        />
      </>
  )
}

export default Input;