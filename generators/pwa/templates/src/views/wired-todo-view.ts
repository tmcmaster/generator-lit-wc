import { html, property, customElement } from 'lit-element';
import {store} from "../redux/store";
import {BaseView} from "./base-view";
import {Todo} from "../models/todo";
import {State} from "../models/state";
//import {getVisibleTodosSelector} from "../redux/reducer";
import { getVisibleTodosSelector } from '../redux/reducer';
import { connect } from 'pwa-helpers';
import { VisibilityFilter } from '../models/visibility-filter';

import 'wired-elements/wired-elements';

import {
    UpdateTodoValueAction,
    UpdateFilterAction,
    AddTodoAction,
    UpdateTodoAction,
    ClearCompletedAction
} from "../redux/actions";

import {WiredInput} from "wired-elements/wired-input";

@customElement('wired-todo-view')
export class TodoView extends connect(store)(BaseView) {
    @property()
    private todos: Todo[];
    @property()
    private filter: string;
    @property()
    private task: string;

    // noinspection JSUnusedGlobalSymbols
    stateChanged(state: State) {
        this.todos = getVisibleTodosSelector(state);
        this.filter = state.filter;
        this.task = state.task;
    }

    // noinspection JSUnusedGlobalSymbols
    render() {
        // noinspection CssInvalidPropertyValue,CssInvalidHtmlTagReference
        return html`
            <style>
                wired-todo-view {
                    display: inline-block;
                    height: 100%;
                    width: 100%;
                    box-sizing: border-box;
                   
                }
                wired-card {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 20px 10px 30px 10px;
                    height: 100%;
                    box-sizing: border-box;
                     border: solid red 2px;
                }
                
                div.add {
                    flex:min-content;
                    padding: 20px 40px 0 30px;
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    width: 100%;
                }
                
                div.add > wired-input {
                    flex: auto;
                }
                div.add > wired-button {
                    margin-left: 20px;
                }
                div.scroll {
                    display: inline-block;
                    flex: auto;
                    width: 100%;
                    box-sizing: border-box;
                }
                div.list {
                    display: inline-block;
                    padding: 20px 20px 0 50px;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                
                div.row {
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    padding-right: 40px;
                }
                
                div.row > wired-input {
                    flex: auto;
                }
                
                div.row > wired-checkbox {
                    width:50px;
                }
                
                div.filter {
                    flex:min-content;
                    //height: 100px;
                    padding: 20px 40px 30px 30px;
                }
                
                div.filter > wired-radio-group {
                    float: left;
                }
                div.filter > wired-button {
                    float: right;
                }
                
                div.layout {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: stretch;
                }
            </style>
            <wired-card id="card" mode="stretch">
            <div class="layout">
                <div class="add">
                    <wired-input id="addInput"
                        placeholder="Task"
                        value="${this.task || ''}"
                        @change="${this.updateTask}"
                    ></wired-input>
                    <wired-button
                        @click="${this.addTodo}"
                    >Add Todo</wired-button>
                </div>
                <div class="scroll">      
                    <div class="list">                
                        ${
                            this.todos.map(todo => html`
                                <div class="row">
                                    <wired-checkbox
                                        ?checked="${todo.complete}"
                                    ></wired-checkbox>
                                    <wired-input class="list"
                                        @change="${(e: { target: HTMLInputElement }) => this.updateTodoValue(todo, e.target.value)}" 
                                        value="${todo.task}"
                                    ></wired-input>
                                </div>
                            `)
                        }
                    </div>
                </div>
                <div class="filter">
                    <wired-radio-group
                        selected="${this.filter}"
                        @selected="${this.filterChanged}"
                    >
                        ${
                            Object.values(VisibilityFilter).map(
                                filter => html `
                                    <wired-radio name="${filter}">${filter}</wired-radio>
                                `
                            )
                        }
                    </wired-radio-group>
                    <wired-button
                        
                    >Clear Complete</wired-button>
                </div>
                </div>
            </wired-card>
           
        `;
    }

    filterChanged(e: { detail: { selected: VisibilityFilter } }) {
        console.log('Filter Changed: ', e.detail.selected);
        store.dispatch(new UpdateFilterAction(e.detail.selected));
        //fireWindowEvent('refresh-element');
        //window.dispatchEvent(new CustomEvent('resize-element'));
    }

    // noinspection JSMethodCanBeStatic
    updateTodoValue(updatedTodo: Todo, value: string) {
        store.dispatch(new UpdateTodoValueAction(updatedTodo, value));
    }

    addTodo() {
        if (this.task) {
            store.dispatch(new AddTodoAction(this.task));
            this.task = '';
            const addInput = (this.shadowRoot!.getElementById('addInput') as WiredInput);
            if (addInput) {
                addInput.value = '';
            }
        }
    }

    shortcutListener(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.addTodo();
        }
    }

    updateTask(e: { target: HTMLInputElement }) {
        this.task = e.target.value;
    }

    // noinspection JSMethodCanBeStatic
    updateTodoStatus(updatedTodo: Todo, complete: boolean) {
        store.dispatch(new UpdateTodoAction(updatedTodo, complete));
    }

    // noinspection JSMethodCanBeStatic
    clearCompleted() {
        store.dispatch(new ClearCompletedAction());
    }
}