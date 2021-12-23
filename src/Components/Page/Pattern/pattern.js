import React, { useState } from "react";
import { UseContext } from "../../../Contract/Context";
import { useHistory } from 'react-router-dom';
import "./pattern.css"

const Pattern = () => {

	const history = useHistory();
	const { web3, Contract } = UseContext()
	const [patternName, setPatternName] = useState();
	const [patternCategory, setPatternCategory] = useState();
	const [patternMoney, setPatternMoney] = useState();
	const [categoriesName, setCategoriesName] = useState();


	const address = web3.eth.defaultAccount;

	async function logOut() {
		web3.eth.personal.lockAccount(address);
		alert("Вы вышли из аккаунта");
		history.push('/Authorization');
	}

	async function createPattern (e) {
		e.preventDefault();
		try {
			await Contract.methods.createPattern(patternName, patternCategory, patternMoney).send({from: address});
			alert('Шаблон создан!');
			let tmp = await Contract.methods.viewPatterns().call();
			alert(`Все шаблоны в системе теперь выглядят так: \n ${tmp}`);
			e.target.reset();
		} catch (e) {
			alert(e);
		}
	}

	async function createCategories(e) {
		e.preventDefault();
		try {
			await Contract.methods.createCatefories(categoriesName).send({from: address});
			alert('Шаблон создан!');
			let tmp = await Contract.methods.viewCategories().call();
			alert(`Все категории в системе теперь выглядят так: \n ${tmp}`);
			e.target.reset();
		} catch (e) {
			alert(e);
		}
	}

	return(
	<>
		<p>Адрес: {address}<br/>
			<button className='exit btn btn-danger btn-lg' onClick={ logOut }>Выйти</button>
		</p>
	<div className='create-patterns'>
		<p>Создание шаблонов</p>
		<form onSubmit={ createPattern }>
			<input className='btn btn-light' required placeholder='Имя' onChange={(e) => setPatternName(e.target.value)}/><br/>
			<input className='btn btn-light' required placeholder='Категория' onChange={(e) => setPatternCategory(e.target.value)}/><br/>
			<input className='btn btn-light' required placeholder='Монеты' onChange={(e) => setPatternMoney(e.target.value)}/><br/>
			<button className='btn btn-success reg-link'>Создать</button>
		</form>
	</div>
	<div className='create-categories'>
		<p>Создание категории</p>
		<form onSubmit={ createCategories }>
				<input className='btn btn-light' required placeholder='Имя' onChange={(e) => setCategoriesName(e.target.value)}/><br/>
				<button className='btn btn-success reg-lin'>Создать</button>
			</form>
	</div>
	</>
	);

}

export default Pattern; 