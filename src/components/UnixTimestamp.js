import React, { useState } from 'react';
import moment from 'moment-timezone';

const UnixTimestamp = () => {
  const [indianDate, setIndianDate] = useState('');
  const [indianTime, setIndianTime] = useState('');
  const [unixTimestamp, setUnixTimestamp] = useState('');

  const handleDateChange = (e) => {
    setIndianDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setIndianTime(e.target.value);
  };

  const convertToUnixTimestamp = () => {
    const indianDateTime = `${indianDate} ${indianTime}`;
    const format = 'YYYY-MM-DD HH:mm'; // Format of input datetime string
    const indianTimezone = 'Asia/Kolkata';

    const momentObj = moment.tz(indianDateTime, format, indianTimezone);
    const timestamp = momentObj.unix();

    setUnixTimestamp(timestamp);
  };

  return (
    <div className="App">
      <h1>Convert Indian Time to Unix Timestamp</h1>
      <p>Format: YYYY-MM-DD HH:mm</p>
      <div>
        <label htmlFor="indianDate">Indian Date:</label>
        <input
          type="date"
          id="indianDate"
          value={indianDate}
          onChange={handleDateChange}
        />
      </div>
      <div>
        <label htmlFor="indianTime">Indian Time:</label>
        <input
          type="time"
          id="indianTime"
          value={indianTime}
          onChange={handleTimeChange}
        />
      </div>
      <button onClick={convertToUnixTimestamp}>Convert</button>
      <p>Unix Timestamp: {unixTimestamp}</p>
    </div>
  );
};

export default UnixTimestamp;
