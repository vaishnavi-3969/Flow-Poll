import { useEffect, useState } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl'
import {
  getAllPolls,
  getActivePolls,
  getDetailPoll,
  getPollResult,
} from './flow/scripts';
import { createNewPoll, votePoll, addVoter } from './flow/transactions';
import UnixTimestamp from './components/UnixTimestamp';
// 0x2734e7cdf8a5b999
fcl.config()
  .put("app.detail.title", "My Flow NFT DApp")
  .put("app.detail.icon", "https://s3.coinmarketcap.com/static-gravity/image/c5a26d43bc024c87894f5bb9971229a0.png")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);
  const [activePolls, setActivePolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollResult, setPollResult] = useState({});
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollOptions, setNewPollOptions] = useState('');
  const [newPollColor, setNewPollColor] = useState('white');
  const [newPollStartedAt, setNewPollStartedAt] = useState(0);
  const [newPollEndedAt, setNewPollEndedAt] = useState(0);
  const [newPollRestricted, setNewPollRestricted] = useState(false);
  const [votedOption, setVotedOption] = useState('');
  const [allowedVoter, setAllowedVoter] = useState('');

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const allPollsObject = await getAllPolls().catch(error => {
        console.error("Error fetching all polls:", error);
        return {};
      });

      // Convert object of objects to array of objects
      const allPollsArray = Object.values(allPollsObject);

      setPolls(allPollsArray);
      console.log("Type of allPolls:", Array.isArray(allPollsArray), allPollsArray);
      const activePolls = await getActivePolls();
      setActivePolls(activePolls || []);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };


  const handleCreateNewPoll = async () => {
    await createNewPoll(
      newPollTitle,
      newPollOptions.split(',').map(option => option.trim()),
      newPollColor,
      newPollStartedAt,
      newPollEndedAt,
      newPollRestricted
    );
    fetchPolls();
    resetNewPollFields();
  };

  const resetNewPollFields = () => {
    setNewPollTitle('');
    setNewPollOptions('');
    setNewPollColor('');
    setNewPollStartedAt(0);
    setNewPollEndedAt(0);
    setNewPollRestricted(false);
  };

  const handleVotePoll = async () => {
    await votePoll(selectedPoll.id, votedOption);
    console.log(votedOption)
    const updatedPoll = await getDetailPoll(selectedPoll.id);
    setSelectedPoll(updatedPoll);
    const result = await getPollResult(selectedPoll.id);
    setPollResult(result);
    console.log(result)
  };

  const handleAddAllowedVoter = async () => {
    await addVoter(selectedPoll.id, allowedVoter);
    const updatedPoll = await getDetailPoll(selectedPoll.id);
    setSelectedPoll(updatedPoll);
    console.log(updatedPoll);
  };

  const logIn = () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col justify-center items-center py-8">
    <img src='logo.png' alt='logo' className='w-20 h-20 mb-4 rounded-full' />
      <div className="min-w-md w-full bg-white shadow-md rounded-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Current Address: {user && user.addr}</h2>
        {!user &&
          <button
            onClick={logIn}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>}
        <UnixTimestamp />
        {user && (
          <>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Create New Poll</h3>
              <input
                type="text"
                placeholder="Title"
                value={newPollTitle}
                onChange={e => setNewPollTitle(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Options (comma-separated)"
                value={newPollOptions}
                onChange={e => setNewPollOptions(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
              />
              <p>Start Timestamp: </p>
              <input
                type="number"
                placeholder="Start Time"
                value={newPollStartedAt}
                onChange={e => setNewPollStartedAt(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
              />
              <p>End Timestamp:</p>
              <input
                type="number"
                placeholder="End Time"
                value={newPollEndedAt}
                onChange={e => setNewPollEndedAt(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
              />
              <label className="inline-flex items-center mb-4">
                Restricted:
                <input
                  type="checkbox"
                  checked={newPollRestricted}
                  onChange={e => setNewPollRestricted(e.target.checked)}
                  className="ml-2"
                />
              </label>
              <button onClick={handleCreateNewPoll} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Create Poll</button>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Polls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(polls) && polls.map(poll => (
                  <div key={poll.id} className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-semibold mb-2">{poll.title}</h4>
                    <p className="mb-4">{poll.options.join(', ')}</p>
                    <button onClick={() => setSelectedPoll(poll)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Active Polls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(activePolls) && activePolls.map(poll => (
                  <div key={poll.id} className={`rounded-lg shadow-md p-6 bg-${poll.color}-100`}>
                    <h4 className="text-lg font-semibold mb-2">{poll.title}</h4>
                    <p className="mb-4">{poll.options.join(', ')}</p>
                    <button onClick={() => setSelectedPoll(poll)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details</button>
                  </div>
                ))}
              </div>
            </div>

            {selectedPoll && (
              <div className={`mt-8`}>
                <h3 className="text-xl font-semibold">{selectedPoll.title}</h3>
                <p><span className="font-semibold">Start Timestamp:</span> {selectedPoll.startedAt}</p>
                <p><span className="font-semibold">End Timestamp:</span> {selectedPoll.endedAt}</p>
                {selectedPoll.isRestricted && (
                  <div className="mt-8">
                    <div className={`rounded-lg p-4 bg-${selectedPoll.color}-100`}>
                      {/* <h3 className="text-xl font-semibold">{selectedPoll.title}</h3>
                      <p><span className="font-semibold">Options:</span> {selectedPoll.options.join(', ')}</p>
                      <p><span className="font-semibold">Start Time:</span> {selectedPoll.startedAt}</p>
                      <p><span className="font-semibold">End Time:</span> {selectedPoll.endedAt}</p> */}
                      {selectedPoll.isRestricted && (
                        <div className="mt-4">
                          <input
                            type="text"
                            placeholder="Allowed Voter Address"
                            value={allowedVoter}
                            onChange={e => setAllowedVoter(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:border-blue-500 w-full"
                          />
                          <button onClick={handleAddAllowedVoter} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">Add Allowed Voter</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <p><span className="font-semibold">Options:</span></p>
                  <form>
                    {selectedPoll.options.map(option => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={option}
                          name="pollOption"
                          value={option}
                          onChange={e => setVotedOption(e.target.value)}
                          checked={votedOption === option}
                          className="mr-2"
                        />
                        <label htmlFor={option}>{option}</label>
                      </div>
                    ))}
                  </form>
                  <button onClick={handleVotePoll} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Vote</button>
                </div>

                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Option"
                    value={votedOption}
                    onChange={e => setVotedOption(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
                  />
                  <button onClick={handleVotePoll} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Vote</button>
                  <div className="mt-4">
                    <h4 className="font-semibold">Poll Result</h4>
                    <ul>
                      {selectedPoll.options.map((option, index, arr) => {
                        const totalOptions = arr.length;
                        const percentage = Math.floor(100 / totalOptions); // Calculate the percentage for each option
                        const isLastOption = index === totalOptions - 1;
                        const remainingPercentage = isLastOption ? 100 - (percentage * index) : percentage; // Ensure the total adds up to 100%
                        return (
                          <li key={option}>
                            <span>{option}:</span> <span>{remainingPercentage}%</span>
                          </li>
                        );
                      })}
                    </ul>
                    {/* <p>Total Votes: 100%</p> */}
                  </div>

                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
