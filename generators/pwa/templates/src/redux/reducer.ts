import { createSelector } from 'reselect';

import {
  Actions,
  AddTodoAction,
  UpdateTodoAction,
  UpdateTodoValueAction,
  UpdateFilterAction,
  ClearCompletedAction,
} from './actions';

import { VisibilityFilter } from '../models/visibility-filter';
import { State } from '../models/state';

export const reducer = (state = new State(), action: Actions): State => {
  switch (action.type) {
    case AddTodoAction.TYPE: return AddTodoAction.apply(state, action);
    case UpdateTodoAction.TYPE: return UpdateTodoAction.apply(state, action);
    case UpdateTodoValueAction.TYPE: return UpdateTodoValueAction.apply(state, action);
    case UpdateFilterAction.TYPE: return UpdateFilterAction.apply(state, action);
    case ClearCompletedAction.TYPE: return ClearCompletedAction.apply(state);
    default: return state;
  }
};

const getTodosSelector = (state: State) => state.todos;
const getFilterSelector = (state: State) => state.filter;

export const getVisibleTodosSelector = createSelector(
  getTodosSelector,
  getFilterSelector,
  (todos, filter) => {
    switch (filter) {
      case VisibilityFilter.SHOW_ACTIVE:
        return todos.filter(todo => !todo.complete);
      case VisibilityFilter.SHOW_COMPLETED:
        return todos.filter(todo => todo.complete);
      default:
        return todos;
    }
  }
);

export const statsSelector = createSelector(
  getTodosSelector,
  todos => {
    const completed = todos.filter(todo => todo.complete).length;
    return {
      completed,
      active: todos.length - completed
    };
  }
);
