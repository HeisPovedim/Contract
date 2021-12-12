import React,{useState} from 'react';
import Web3 from 'web3';
import {BrowserRouter as Router} from 'react-router-dom';
import {UserList} from '../../Contract/UserList';
import {Context} from '../../Contract/Context';
import Routers from '../../router';

const App = () => {
	const [web3] =useState(new Web3('HTTP://127.0.0.1:8545'));
	const AddressContract='0xE6f0663528B9dF8368f1159837F56B5f2d0Aee04';
	const [Contract] = useState(new web3.eth.Contract(UserList,AddressContract));
	web3.eth.defaultAccount='0x0000000000000000000000000000000000000000'

	return(
		<Router>
		<Context.Provider value={{web3,Contract}}>
			<Routers/>
		</Context.Provider>
		</Router>)
}

export default App