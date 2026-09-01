import React from 'react';

function StartDateInput({ value, onChange }) {
  return (
    <input type="text" value={value} onChange={onChange} placeholder="Start Date" />
  );
}

export default StartDateInput;