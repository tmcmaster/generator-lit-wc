import {html, LitElement} from 'lit-element';

class NewWebComponent extends LitElement {

    // noinspection JSUnusedGlobalSymbols
    static get properties() {
        return {
            heading: {type: String}
        }
    }

    constructor() {
        super();
        this.heading = 'Hello World! from the <%= elementName %> web component';
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        return html`
      <style>
        :host {
          display: inline-block;
        }
        h2 {
            color: gray;
        }
      </style>
      <h2>${this.heading}</h2>
    `;
    }


}

window.customElements.define('<%= elementName %>', NewWebComponent);