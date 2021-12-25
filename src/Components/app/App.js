import React,{useState} from 'react';
import Web3 from 'web3';
import {BrowserRouter as Router} from 'react-router-dom';
import {UserList} from '../../Contract/UserList';
import {Context} from '../../Contract/Context';
import Routers from '../../router';

const App = () => {
	const [web3] =useState(new Web3('HTTP://127.0.0.1:8545'));
	const AddressContract='0xA99dD5A595b632418D2cB307F94Dc0ffEb5585c2';
	const [Contract] = useState(new web3.eth.Contract(UserList,AddressContract));
	web3.eth.defaultAccount='0x635302E3158503b36F9cd8264f55349aEf2d3294'

	return(
		<Router>
		<Context.Provider value={{web3,Contract}}>
			<Routers/>
		</Context.Provider>
		</Router>)
}

export default App