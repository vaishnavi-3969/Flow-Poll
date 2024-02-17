import { useEffect, useState } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl'
import { 
  getAllPolls,
  getActivePolls,
  getDetailPoll,
  getPollResult,
} from './flow/scripts';
import { createNewPoll,votePoll, addVoter } from './flow/transactions';
// 0x2734e7cdf8a5b999
fcl.config()
  .put("app.detail.title", "My Flow NFT DApp")
  .put("app.detail.icon", "https://s3.coinmarketcap.com/static-gravity/image/c5a26d43bc024c87894f5bb9971229a0.png")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
// .put("0xFlowToken", "0x6b99a38d92926fc6")

function App() {
  const [user, setUser] = useState();
  const [polls, setPolls] = useState([]);
  const [activePolls, setActivePolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollResult, setPollResult] = useState({});
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollOptions, setNewPollOptions] = useState([]);
  const [newPollColor, setNewPollColor] = useState('');
  const [newPollStartedAt, setNewPollStartedAt] = useState(0);
  const [newPollEndedAt, setNewPollEndedAt] = useState(0);
  const [newPollRestricted, setNewPollRestricted] = useState(false);
  const [votedOption, setVotedOption] = useState('');
  const [allowedVoter, setAllowedVoter] = useState('');

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    const allPolls = await getAllPolls();
    setPolls(allPolls);
    const activePolls = await getActivePolls();
    setActivePolls(activePolls);
  };
  
  const handleCreateNewPoll = async () => {
    await createNewPoll(newPollTitle, newPollOptions, newPollColor, newPollStartedAt, newPollEndedAt, newPollRestricted);
    fetchPolls();
    // Reset form fields after creating a new poll
    setNewPollTitle('');
    setNewPollOptions([]);
    setNewPollColor('');
    setNewPollStartedAt(0);
    setNewPollEndedAt(0);
    setNewPollRestricted(false);
  };

  const handleVotePoll = async () => {
    await votePoll(selectedPoll.id, votedOption);
    // Refresh poll data after voting
    const updatedPoll = await getDetailPoll(selectedPoll.id);
    setSelectedPoll(updatedPoll);
    const result = await getPollResult(selectedPoll.id);
    setPollResult(result);
  };

  const handleAddAllowedVoter = async () => {
    await addVoter(selectedPoll.id, allowedVoter);
    // Refresh poll data after adding allowed voter
    const updatedPoll = await getDetailPoll(selectedPoll.id);
    setSelectedPoll(updatedPoll);
  };


  const logIn = () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  }
  return (
     <div className="App">
      <h1>Voting App</h1>
      <h2>Current Address: {user && user.addr ? user.addr : ''}</h2>

      {/* Login button */}
      {!user && <button onClick={() => logIn()}>Login</button>}

      {/* New Poll Form */}
      {user && (
        <div>
          <h3>Create New Poll</h3>
          <input type="text" placeholder="Title" value={newPollTitle} onChange={(e) => setNewPollTitle(e.target.value)} />
          <input type="text" placeholder="Options (comma-separated)" value={newPollOptions.join(',')} onChange={(e) => setNewPollOptions(e.target.value.split(','))} />
          <input type="text" placeholder="Color" value={newPollColor} onChange={(e) => setNewPollColor(e.target.value)} />
          <input type="number" placeholder="Start Time" value={newPollStartedAt} onChange={(e) => setNewPollStartedAt(e.target.value)} />
          <input type="number" placeholder="End Time" value={newPollEndedAt} onChange={(e) => setNewPollEndedAt(e.target.value)} />
          <label>
            Restricted:
            <input type="checkbox" checked={newPollRestricted} onChange={(e) => setNewPollRestricted(e.target.checked)} />
          </label>
          <button onClick={handleCreateNewPoll}>Create Poll</button>
        </div>
      )}

      {/* Display Polls */}
      <div>
        <h3>Polls</h3>
        <ul>
          {polls.map((poll) => (
            <li key={poll.id}>
              <span>{poll.title}</span>
              <button onClick={() => setSelectedPoll(poll)}>View Details</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Display Active Polls */}
      <div>
        <h3>Active Polls</h3>
        <ul>
          {activePolls.map((poll) => (
            <li key={poll.id}>
              <span>{poll.title}</span>
              <button onClick={() => setSelectedPoll(poll)}>View Details</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Poll Detail */}
      {selectedPoll && (
        <div>
          <h3>{selectedPoll.title}</h3>
          <p>Options: {selectedPoll.options.join(', ')}</p>
          <p>Color: {selectedPoll.color}</p>
          <p>Start Time: {selectedPoll.startedAt}</p>
          <p>End Time: {selectedPoll.endedAt}</p>
          {selectedPoll.isRestricted && (
            <div>
              <input type="text" placeholder="Allowed Voter Address" value={allowedVoter} onChange={(e) => setAllowedVoter(e.target.value)} />
              <button onClick={handleAddAllowedVoter}>Add Allowed Voter</button>
            </div>
          )}
          <div>
            <input type="text" placeholder="Option" value={votedOption} onChange={(e) => setVotedOption(e.target.value)} />
            <button onClick={handleVotePoll}>Vote</button>
          </div>
          <h4>Poll Result</h4>
          <ul>
            {Object.entries(pollResult).map(([option, count]) => (
              <li key={option}>
                <span>{option}</span>: <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
