import React, { useState } from "react";
import { UseContext } from "../../../Contract/Context";
import { useHistory } from 'react-router-dom';
import './vote.css';

const Vote = () => {
	const history = useHistory();
	const { web3, Contract } = UseContext()
	const [AdrUserApp, setAdrUserApp] = useState();
	const [ForIdUserUps, setForIdUserUps] = useState();
	const [AgainIdUserUps, setAgainIdUserUps] = useState();
	const address = web3.eth.defaultAccount;

	async function logOut() {
		web3.eth.personal.lockAccount(address);
		alert("Вы вышли из аккаунта");
		history.push('/Authorization');
	}

	async function offersToUesrUp(e) {
		e.preventDefault();
		try{
			await Contract.methods.offersToUesrUp(AdrUserApp).send({from: address});
			let tmp = await Contract.methods.getLenghtIdUserUps().call();
			e.target.reset();
			alert(`Адрес добавлен! Ваш id: ${tmp - 1}`);
		} catch (e) {
			alert(e);
		}
	}

	async function voitingFor(e) {
		e.preventDefault();
		try {
			await Contract.methods.voitingFor(ForIdUserUps).send({from: address});
			e.target.reset();
			console.log(alert('Голос отдан за!'));
		} catch (e) {
			console.log(alert(e));
		}
	}

	async function voitingAgain(e) {
		e.preventDefault();
		try {
			await Contract.methods.voitingAgain(AgainIdUserUps).send({from: address});
			e.target.reset();
			console.log(alert('Вы отдали голос против!'))
		} catch {
			console.log(alert(e));
		}
	}

	return (
	<>
		<p>Адрес: { address } <br/>
			<button className='exit btn btn-danger btn-lg' onClick={ logOut }>Выйти</button>
		</p>
		
		<p>Выдвижения пользователя в админы</p>
			<form onSubmit={ offersToUesrUp }>
				<input className='btn btn-light' placeholder="Адрес в админы" onChange={(e) => setAdrUserApp(e.target.value)}/><br/>
				<button className='to_send btn btn-dark reg-link'>Отправить</button><br/>
			</form>
		<p>Голос ЗА</p>
			<form onSubmit={ voitingFor }>
				<input className='btn btn-light' placeholder='id транзакции' onChange={(e) => setForIdUserUps(e.target.value)}/><br/>
				<button className='to_send btn btn-dark reg-link'>Отправить</button><br/>
			</form>
	<p>Голосвание ПРОТИВ</p>
			<input className='btn btn-light' required placeholder='id транзакции' onChange={(e) => setAgainIdUserUps(e.target.value)}/><br/>
			<button onClick={ voitingAgain } className='to_send btn btn-dark reg-link'>Отправить</button><br/>
		</>
	);
};

export default Vote