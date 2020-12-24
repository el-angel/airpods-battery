import React from 'react'
import { render } from 'react-dom'
import isConnected from './helpers/isConnected'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  const connected = isConnected();
  const connection = connected ? 'connected' : 'not connected';

  return (
    <>
    <div style={{ color: 'white'}}>{connection}</div>
    </>
  );
}

render(<App />, mainElement)
