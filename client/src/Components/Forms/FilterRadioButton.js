import {ToggleButton, ButtonGroup} from "react-bootstrap";
import {useState} from "react";

function FilterRadioButton(props) {
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('1');
  
  const radios = [
    { name: 'Show All', value: '1' },
    { name: "Today's Check-ins", value: '2' },
    { name: "Tomorrow's Check-ins", value: '3' },
  ];
  
  return (
      <>
        <ToggleButton
            className="d-none"
            id="toggle-check"
            type="checkbox"
            variant="outline-primary"
            checked={checked}
            value="1"
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
            }}
        >
          Checked
        </ToggleButton>
        <br className="d-md-none"/>
        <ButtonGroup className={"mt-3 mb-3"}>
          {radios.map((radio, idx) => (
              <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={idx % 2 ? 'outline-info' : 'outline-primary'}
                  name={"radio"}
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => {
                    setRadioValue(e.currentTarget.value)
                    if (idx === 0) {
                      props.setFilterBy('all');
                      props.refresh('all');
                    } else if (idx === 1) {
                      props.setFilterBy('today');
                      props.refresh('today');
                    } else {
                      props.setFilterBy('tomorrow');
                      props.refresh('tomorrow')
                    }
                  }}
              >
                {radio.name}
              </ToggleButton>
          ))}
        </ButtonGroup>
      </>
  );
}

export default FilterRadioButton;