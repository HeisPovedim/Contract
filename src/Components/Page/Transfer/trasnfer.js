import React, { useState, useEffect } from "react";
import { UseContext } from "../../../Contract/Context";
import { useHistory } from 'react-router-dom';
import './trasnfer.css';

const Transfer = () => {
	const history = useHistory();
	const {web3, Contract} = UseContext();
	const [addressTo, setAddressTo] = useState();
	const [value, setValue] = useState();
	const [codeword, setCodeword] = useState();
	const [categoryId, setCategoryId] = useState();
	const [description, setDescription] = useState();
	const [transferID, setTransferID] = useState();
	const [setPattern] = useState();
	const [patterns, setPatterns] = useState([]);
	const address = web3.eth.defaultAccount;
	const [balance, setBalance] = useState();

	useEffect(() => {
		async function listPatterns() {
			let Patterns = await Contract.methods.viewPatterns().call();
			let patternNames = Object.values(Patterns);
			patternNames.splice(0, 0, "Шаблон не выбран");
			setPatterns(patternNames);
		}
		listPatterns();


		async function getBalance() {
			let balance = await Contract.methods.getBalance(address).call() / 10**18;
			setBalance(balance);
		}
		getBalance();
	},);

	async function logOut() {
		web3.eth.personal.lockAccount(address);
		alert("Вы вышли из аккаунта");
		history.push('/Page 1');
	}

	async function createTransfer(e) {
		e.preventDefault();
		try {
			await Contract.methods.createTransfer(addressTo, codeword, categoryId, description).send({from: address, value: value});
			const transferId = await Contract.methods.getTransferID().call();
			e.target.reset();
			alert(`ID перевода: ${transferId}`);
		}
		catch(e) {
			alert(e);
		}
	}

	async function confirmTransfer(e) {
		e.preventDefault();
		try {
			await Contract.methods.confirmTransfer(transferID, codeword).send({from: address});
			e.target.reset();
			alert(`Перевод принят`);
		}
		catch(e) {
			alert(e);
		}
	}

	async function cancelTransfer(e) {
		e.preventDefault();
		try {
			await Contract.methods.cancelTransfer(transferID).send({from: address});
			e.target.reset();
			alert(`Перевод отменён`);
		}
		catch(e) {
			alert(e)
		}
	}

	return(<>
	<p>Адрес: {address}<br/>
		Баланс: {balance} ETH<br/>
		<button className='exit btn btn-danger btn-lg' onClick={logOut}>Выйти</button>
	</p>
	

	<h3 className='transfer'>Переводы</h3>
	<p className='create_trasnfer'>Создать перевод</p>
	<form onSubmit={createTransfer}>
		<input className='btn btn-light' required placeholder="Адрес" onChange={(e)=>setAddressTo(e.target.value)}/><br/>
		<input className='btn btn-light' required placeholder="Сумма" onChange={(e)=>setValue(e.target.value)}/><br/>
		<input className='btn btn-light' required placeholder="Кодовое слово" onChange={(e)=>setCodeword(e.target.value)}/><br/>
		<input className='btn btn-light' required placeholder="ID категории" onChange={(e)=>setCategoryId(e.target.value)}/><br/>
		<input className='btn btn-light' placeholder="Описание" onChange={(e)=>setDescription(e.target.value)}/><br/>
		<p className='pattern'>Шаблон:</p>
		<select className='btn btn-light' onChange={(e)=>setPattern(e.target.value)}>
			{patterns.map((arr, i)=><option key={i} value={String(arr)}>{arr}</option>)}
		</select><br/>
		<button className='to_send btn btn-success reg-link'>Отправить</button><br/>
	</form>

	<p className='accept_transfer'>Принять перевод</p>
	<form onSubmit={confirmTransfer}>
		<input className='btn btn-light' required placeholder="ID перевода" onChange={(e)=>setTransferID(e.target.value)}/><br/>
		<input className='btn btn-light' required placeholder="Кодовое слово" onChange={(e)=>setCodeword(e.target.value)}/><br/>
		<button className='accept btn btn-success reg-link'>Принять</button><br/>
	</form>

	<p>Отменить перевод</p>
	<form onSubmit={cancelTransfer}>
		<input className='btn btn-light' required placeholder="ID перевода" onChange={(e)=>setTransferID(e.target.value)}/><br/>
		<button className='not btn btn-success reg-link'>Отменить</button><br/>
	</form>
	</>)
}

export default Transfer;