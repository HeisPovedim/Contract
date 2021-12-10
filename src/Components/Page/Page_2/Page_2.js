import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { UseContext } from "../../../Contract/Context";
import './Page_2.css'

const Page_2 = () => {
	const { web3, Contract } = UseContext()
	const [setAccounts] = useState([])
	const [FIO, setFIO] = useState('')
	const [password, setPassword] = useState('')

	//-------------------------------------------------------------------------------
	const hadleFIO=(e)=>{
		setFIO(e.target.value)
	}
	const hadlePassword=(e)=>{
		setPassword(e.target.value)
	}

	const Registration=async(e)=>{
		e.preventDefault()
		try{
			let adr = await web3.eth.personal.newAccount(password)
			let Users = await web3.eth.getAccounts()
			await web3.eth.sendTransaction({from:Users[0], to:adr, gas: 200000, value: 50000000000000000000})
			Users[0]="Выберите адрес" //затирает нулевой адрес в списке
			setAccounts(Users)
			await web3.eth.personal.unlockAccount(adr,password,600)
			await Contract.methods.addUser(FIO, adr).send({from:adr, gas:200000})
			alert("Вы зарегистрировались, запомните свой адрес: " + adr)
		}catch(e){
			alert(e)
		}
	}

	return (<>
			<h4>Регистрация</h4>
			<form onSubmit={Registration}>
				<input required onChange = {hadleFIO} placeholder = "ФИО" className='btn btn-primary input-fio'></input>
				<input required type = "password" onChange = {hadlePassword} placeholder = "Пароль" className='btn btn-warning pas-input'></input>
				<button className='btn btn-dark but-reg'>Зарегистрироваться</button>
				<Link to="./Page 1" className='btn btn-dark link-ex'>Назад</Link>
			</form>
			</>
	);
};

export default Page_2;