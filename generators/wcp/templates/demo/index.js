import {html, render} from 'lit-html';

import '../src/index.js';

render(html`
    <style>
    :host {
    }

    body {
      background-color: #ededed;
    }
    
    body > * {
        clear: both;
        float: left;
    }
  </style>
  
<%- elementBlock %>
  

`, document.querySelector('body'));
