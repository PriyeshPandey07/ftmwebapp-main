import React from 'react';

function EndDateInput({ value, onChange }) {
  return (
    <input type="text" value={value} onChange={onChange} placeholder="End Date" />
  );
}

export default EndDateInput;