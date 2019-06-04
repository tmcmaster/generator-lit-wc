import {html, property, customElement} from 'lit-element';
import {connect} from 'pwa-helpers';

import {selector} from '../redux/selector';
import {store} from '../redux/store';

import {User} from '../models/user';
import {Role} from '../models/role';
import {State} from '../models/state';
import {
    UserActions,
    InputActions
} from '../actions/user';

import {BaseView} from './base-view';

import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';

const ROLE_OPTIONS = JSON.stringify(
    Object.values(Role).map(r => {
        return {label: r.toString(), value: r.toString()}
    })
);

@customElement('user-view')
export class UserView extends connect(store)(BaseView) {
    @property()
    private name: string;
    @property()
    private role: Role;
    @property()
    private enabled: boolean;
    @property()
    private filter: Role;

    @property()
    private users: User[];

    constructor() {
        super();
    }

    // noinspection JSUnusedGlobalSymbols
    firstUpdated() {

    }

    // noinspection JSUnusedGlobalSymbols
    stateChanged(state: State) {
        console.log('DEBUG => updating view from state.', state);
        this.users = selector.user.filtered(state);
        this.filter = state.view.user.filter;
        this.name = state.view.user.name;
        this.role = state.view.user.role;
        this.enabled = state.view.user.enabled;
        console.log('DEBUG => Role', this.role);
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        // noinspection CssInvalidPropertyValue,CssInvalidHtmlTagReference
        return html`
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    max-width: 100%;
                    height: 100%;
                    margin: 0 auto;
                    box-sizing: border-box;
                    //border: solid blue 2px;
                }
                
                .user-input {
                    flex:none;
                }
                
                .role-list {
                    flex: none;
                }
                
                .user-item {
                    flex: auto;
                }
                
                .role-filter {
                    padding-left: 40px;
                }
                
                .user-input, .role-list, .user-item {
                    padding: 5px 10px 5px 10px;
                    max-width: 100%;
                    display: flex;
                    margin-bottom: 5px;
                    flex-wrap:  wrap;
                    box-sizing: border-box;
                    //border: solid grey 2px;
                }

                .enabled {
                    margin: 10px 0 0 0;
                    flex: none;
                }
                
                .name {
                    margin-left: 10px;
                    flex: 3;
                }
                
                .role {
                    margin-left: 10px;
                    flex: 1;
                }
                
                .add, .delete {
                    margin-left: 10px;
                    flex: 1;
                }
                
                .roles {
                    flex: 1;                
                }
                
                h3 {
                    text-align: center;
                }
            </style>
      
            <h3>User Administration</h3>
      
            <div class="user-input">
                <vaadin-checkbox class="enabled"
                    ?checked="${this.enabled}"
                    @change="${(e: { target: HTMLInputElement }) => store.dispatch(new InputActions.Enabled(e.target.checked))}"
                ></vaadin-checkbox>
                
                <vaadin-text-field class="name" 
                    @keyup="${(e: KeyboardEvent) => {if (e.key === 'Enter') this.addUser(this.name, this.role, this.enabled)}}"
                    placeholder="User Name"
                    value="${this.name || ''}"
                    @change="${(e: { target: HTMLInputElement }) => store.dispatch(new InputActions.Name(e.target.value))}"
                ></vaadin-text-field>
                
                <vaadin-combo-box class="role"
                    placeholder="User Role" 
                    value="${this.role}" 
                    items="${ROLE_OPTIONS}"
                    @change="${(e: { target: HTMLInputElement }) => store.dispatch(new InputActions.Role(e.target.value as Role))}"
                >
                    <template>[[item.label]]</template>
                </vaadin-combo-box>
                

                <vaadin-button class="add"
                    theme="primary" 
                    @click="${() => this.addUser(this.name, this.role, this.enabled)}"
                >Add User</vaadin-button>
            </div>
            
            <div class="role-filter">
                <vaadin-radio-group
                    class="roles"
                    value="${this.filter}"
                    @value-changed="${(e: { detail: { value: Role } }) => store.dispatch(new InputActions.Filter(e.detail.value))}"
                >
                    ${Object.values(Role).map(filter => html`
                        <vaadin-radio-button value="${filter}"
                        >${filter}</vaadin-radio-button
                        >
                    `)}
                </vaadin-radio-group>
            </div>
            

            
            <div class="user-list">
                ${
                    this.users.map(user => html`
                        <div class="user-item">
                            <vaadin-checkbox class="enabled"
                                data-id="${user.id}"
                                ?checked="${user.enabled}"
                                @change="${(e: { target: HTMLInputElement }) => store.dispatch(new UserActions.Update({...user, enabled:e.target.checked}))}"
                            ></vaadin-checkbox>
                            <vaadin-text-field class="name"
                                .disabled="${!user.enabled}"
                                placeholder="User Name"
                                value="${user.name || ''}"
                                @change="${(e: { target: HTMLInputElement }) => store.dispatch(new UserActions.Update({...user, name: e.target.value}))}"
                            ></vaadin-text-field>
                            <vaadin-combo-box class="role"
                                value="${user.role}" 
                                items="${ROLE_OPTIONS}"
                                @change="${(e: { target: HTMLInputElement }) => store.dispatch(new UserActions.Update({...user, role: e.target.value as Role}))}"
                            ><template>[[item.label]]</template></vaadin-combo-box>
                            <vaadin-button class="delete"
                                @click="${this.deleteUser(user)}"
                            >Delete User</vaadin-button>
                        </div>
                    `)
                }
            </div>
        `;
    }

    addUser(name:string, role:Role, enabled:boolean) {
        store.dispatch(new UserActions.Add(name, role, enabled));
        store.dispatch(new InputActions.Name(''));
    }

    deleteUser(user: User) {
        return () => {
            console.log('About to dispatch a delete action.')
            store.dispatch(new UserActions.Delete(user));
        }
    }
}

