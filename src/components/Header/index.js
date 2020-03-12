import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'

export default function Header() {
  return (
    <header className="container">
      <Link>
        <img className="logo" src={logo} alt="Logo Projeto" />
      </Link>

      <Link>
        <div>
          <strong>Minhas Reservas</strong>
          <span>0 reservas</span>
        </div>
      </Link>
    </header>
  )
}
