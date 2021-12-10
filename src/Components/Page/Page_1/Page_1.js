import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { UseContext } from "../../../Contract/Context";
import './Page_1.css';
const LogIn = () => {

	const { web3, Contract } = UseContext()
	const [Accounts, setAccounts] = useState([])
	const [address, setAddress] = useState('')
	const [password, setPassword] = useState('')

	const hadlePassword = (e) => {
		setPassword(e.target.value)
	}
	const handleAddress = (e) => {
		setAddress(e.target.value)
	}

	const about_info =async () =>{
		try{
			console.log(sessionStorage.getItem("address"));
			await about_user();

		}catch(e){
			console.log(e);
		}
	}

	const about_user = async () =>{

		try{
			let temp = await Contract.methods.users(sessionStorage.getItem("address")).call();
			var balance = await web3.eth.getBalance(sessionStorage.getItem("address")); //Will give value in.
			console.log(balance);
			alert('\n Адрес: '+ sessionStorage.getItem("address") +'\n Логин: '+ temp[0] + '\n Роль: '+ temp[3] + '\n Баланс: ' + balance);
		}catch(e){
			console.log(e)
		}
	}

useEffect(() => {
	const ListAccounts = async() => {
		let Users= await web3.eth.getAccounts()
		Users[0]="Выберите адрес" //затирает нулевой адрес в списке
		setAccounts(Users)
	}
	ListAccounts()
},)

	const Authorisation = async(e) => {
	e.preventDefault()
	try{
		await web3.eth.personal.unlockAccount(address, password, 0)
		web3.eth.defaultAccount = address;
		sessionStorage.setItem("address", address)
		await reLogin()
		alert("Вы авторизовались")
	}catch(e){
		alert(e)
	}
}

const reLogin = async () => {
	let tmp = await Contract.methods.addUser(sessionStorage.getItem("address"), password).call();
	console.log(tmp)
};

	return (
	<>
		<h4>Авторизация</h4>
		<form onSubmit={ Authorisation }>
			<select onChange = { handleAddress } className='btn btn-primary select-auto'>
				{Accounts.map((arr,i)=><option key={i} value={String(arr)}>{arr}</option>)}
			</select>
			<input type = "text" onChange = { hadlePassword } placeholder = "Пароль" className='btn btn-warning pas-input'></input>
			<button className='btn btn-dark but-auto'>Авторизоваться</button>
			<Link className='link' to="./Page_2" className='btn btn-dark reg-link'>Зарегистрироваться</Link>
			<div className="lite">
				<button className='btn btn-dark reg-link' onClick={about_info}>Получить информацию</button>
				<Link className='link' to="./Transfer" className='btn btn-dark reg-link'>Перевод</Link>
				<Link className='link' to="./Vote" className='btn btn-dark reg-link'>Голосование</Link>
				<Link className='link' to="./Pattern" className='btn btn-dark reg-link'>Шаблоны</Link>

			</div>
		</form>
	</>
	);
};

export default LogIn;
