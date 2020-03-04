import React from 'react'
import { Container } from '../../styles/GlobalStyles'
import { Title, Paragraph } from './styled'

import axios from '../../services/axios'

export default function Login() {
  React.useEffect(() => {}, [])

  return (
    <Container>
      <Title>
        Login
        <small> Oie</small>
      </Title>
      <Paragraph>Lorem ipsum dolor sit amet.</Paragraph>
      <button type="button">Enviar</button>
    </Container>
  )
}
