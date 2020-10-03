import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

export function HelloWorld() {
    return (
        <div>HELLO!</div>
    );
}

ReactDOM.render(<HelloWorld />, document.getElementById('root'));
