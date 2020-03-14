import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
import './styled.css'

export default function Header() {
  return (
    <header className="container">
      <Link to="/">
        <img className="logo" src={logo} alt="Logo Projeto" />
      </Link>

      <Link className="reservation" to="/reservation">
        <div>
          <strong>Minhas Reservas </strong>
          <span>0 reservas</span>
        </div>
      </Link>
    </header>
  )
}
