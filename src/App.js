import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
// import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TicketMaster from './abis/TicketMaster.json'

// Config
// localhost
// import config from './configLocal.json'
// testnet
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [ticketMaster, setTicketMaster] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const ticketMaster = new ethers.Contract(config[network.chainId].TicketMaster.address, TicketMaster, provider)
    setTicketMaster(ticketMaster)

    const totalOccasions = await ticketMaster.totalOccasions()
    const occasions = []

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await ticketMaster.getOccassion(i)
      occasions.push(occasion)
    }

    setOccasions(occasions)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />

        <h2 className="header__title"><strong>Event</strong> Tickets</h2>
      </header>

      {/* <Sort /> */}

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            ticketMaster={ticketMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          ticketMaster={ticketMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;