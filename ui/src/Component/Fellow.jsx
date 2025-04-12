import React, { useEffect, useState } from "react";

function Fellow() {
  const [selectedFellows, setSelectedFellows] = useState([]);

  const handleChange = (event) => {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedFellows(selectedValues);
  };

  useEffect(()=>{
    console.log(selectedFellows)
  },[selectedFellows]);

  return (
    <React.Fragment>
      <label>Select Fellows:</label>
      <select multiple value={selectedFellows} onChange={handleChange}>
        <option value="John">John</option>
        <option value="Jane">Jane</option>
        <option value="Doe">Doe</option>
        <option value="Smith">Smith</option>
      </select>

    </React.Fragment>
  );
}

export default Fellow;
