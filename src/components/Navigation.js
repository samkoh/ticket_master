import { ethers } from 'ethers'

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>Web3 Event</h1>

                <input className='nav__search' type="text" placeholder='Explore millions of experiences' />

                <ul className='nav__links'>
                    <li><a href="/">Metaverse</a></li>
                    <li><a href="/">DeFi</a></li>
                    <li><a href="/">AI</a></li>
                    <li><a href="/">More</a></li>
                </ul>
            </div>

            {account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect
                </button>
            )}
        </nav>
    );
}

export default Navigation;