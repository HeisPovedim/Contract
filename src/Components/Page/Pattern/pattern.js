import React, { useState, useEffect } from "react";
import { UseContext } from "../../../Contract/Context";
import { useHistory } from 'react-router-dom';
import "./pattern.css"

const Pattern = () => {

	const history = useHistory();
	const { web3, Contract } = UseContext()
	const [patterns, setPatterns] = useState([]);
	const [patternName, setPatternName] = useState();
	const [patternCategory, setPatternCategory] = useState();
	const [patternMoney, setPatternMoney] = useState();
	const [categories, setСategories] = useState([]);
	const [categoriesName, setCategoriesName] = useState();


	const address = web3.eth.defaultAccount;

	async function logOut() {
		web3.eth.personal.lockAccount(address);
		alert("Вы вышли из аккаунта");
		history.push('/Page 1');
	}

	async function createPattern (e) {
		e.preventDefault();
		try {
			await Contract.methods.createPattern(patternName, patternCategory, patternMoney).send({from: address});
			alert('Шаблон создан!');
		} catch (e) {
			alert(e);
		}
	}

	async function createCategories(e) {
		e.preventDefault();
		try {
			await Contract.methods.createCatefories(categoriesName).send({from: address});
			alert('Шаблон создан!');
		} catch (e) {
			alert(e);
		}
	}

	useEffect(() => {
		async function listPatterns() {
			let Patterns = await Contract.methods.viewPatterns().call();
			let patternNames = Object.values(Patterns);
			patternNames.splice(0, 0, "Шаблоны");
			setPatterns(patternNames);
		}
		listPatterns();

		async function listСategories() {
			let Сategories = await Contract.methods.viewCategories().call();
			let categorieNames = Object.values(Сategories);
			categorieNames.splice(0, 0, "Категории");
			setСategories(categorieNames);
		}
		listСategories();
	},)

	return(
	<>
	<p>Адрес: {address}<br/>
		<button className='exit btn btn-danger btn-lg' onClick={ logOut }>Выйти</button>
	</p>
	<div className='patterns'>
		<p>Просмотр шаблонов</p>
			<select className='select-patterns btn btn-light'>
				{patterns.map((arr, i)=><option key={i} value={String(arr)}>{arr}</option>)}
			</select><br/>
	</div>
	<div className='create-patterns'>
		<p>Создание шаблонов</p>
		<form onSubmit={ createPattern }>
			<input className='btn btn-light btn-sm' required placeholder='Имя' onChange={(e) => setPatternName(e.target.value)}/><br/>
			<input className='btn btn-light btn-sm' required placeholder='Категория' onChange={(e) => setPatternCategory(e.target.value)}/><br/>
			<input className='btn btn-light btn-sm' required placeholder='Монеты' onChange={(e) => setPatternMoney(e.target.value)}/><br/>
			<button className='btn btn-success reg-link'>Создать</button>
		</form>
	</div>
	<div className='categories'>
		<p>Просмотр категории</p>
			<select className='select-patterns btn btn-light'>
				{categories.map((arr, i)=><option key={i} value={String(arr)}>{arr}</option>)}
			</select><br/>
	</div>
	<div className='create-categories'>
		<p>Создание категории</p>
		<form onSubmit={ createCategories }>
				<input className='btn btn-light btn-sm' required placeholder='Имя' onChange={(e) => setCategoriesName(e.target.value)}/><br/>
				<button className='btn btn-success reg-link'>Создать</button>
			</form>
	</div>
	</>
	);

}

export default Pattern; 