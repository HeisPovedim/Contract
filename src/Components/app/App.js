import React,{useState} from 'react';
import Web3 from 'web3';
import {BrowserRouter as Router} from 'react-router-dom';
import {UserList} from '../../Contract/UserList';
import {Context} from '../../Contract/Context';
import Routers from '../../router';

const App = () => {
	const [web3] =useState(new Web3('HTTP://127.0.0.1:8545'));
	const AddressContract='0xa34879b3Db1B71828FAb8c26B48AB9Af6c5943b3';
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