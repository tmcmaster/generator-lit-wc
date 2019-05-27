import {html, render} from 'lit-html';

import '../src/<%= elementName %>.js';

render(html`
    <style>
    :host {
    }

    body {
      background-color: #ededed;
    }
  </style>
  
  <<% elementName %>></<% elementName %>>
  

`, document.querySelector('body'));
