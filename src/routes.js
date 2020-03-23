import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Home from './pages/Home'
import Reservations from './pages/Reservations'

export default function Routes(){
  return(
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/reservas' component={Reservations}></Route>
    </Switch>
  )
}
