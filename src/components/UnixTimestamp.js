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
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center py-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-8">
        <h1 className="text-3xl font-semibold mb-4">Convert Indian Time to Unix Timestamp</h1>
        <p className="text-gray-500 mb-4">Format: YYYY-MM-DD HH:mm</p>
        <div className="mb-4">
          <label htmlFor="indianDate" className="block text-sm font-medium text-gray-700">Indian Date:</label>
          <input
            type="date"
            id="indianDate"
            value={indianDate}
            onChange={handleDateChange}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="indianTime" className="block text-sm font-medium text-gray-700">Indian Time:</label>
          <input
            type="time"
            id="indianTime"
            value={indianTime}
            onChange={handleTimeChange}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button onClick={convertToUnixTimestamp} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Convert</button>
        {unixTimestamp && (
          <p className="text-gray-700 mt-4">Unix Timestamp: {unixTimestamp}</p>
        )}
      </div>
    </div>
  );
};

export default UnixTimestamp;
