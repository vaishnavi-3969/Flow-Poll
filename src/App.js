import { useState } from 'react';
import './App.css';
import * as fcl from '@onflow/fcl'
// 0x2734e7cdf8a5b999
fcl.config()
  .put("app.detail.title", "My Flow NFT DApp")
  .put("app.detail.icon", "https://www.svgrepo.com/show/85124/cat.svg")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
// .put("0xFlowToken", "0x6b99a38d92926fc6")

function App() {
  const [user, setUser] = useState();
  const logIn = () => {
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  }
  return (
    <div className="App">
      <h1>My Flow NFT DApp</h1>
      <h2>Current Address: {user && user.addr ? user.addr : ''}</h2>
      <button onClick={() => logIn()}>Login</button>
    </div>
  );
}

export default App;
