import nanoid from 'nanoid';
import { Todo } from '../models/todo';
import { VisibilityFilter } from '../models/visibility-filter';

import { State } from '../models/state';

export interface Action {
  type: string;
  //apply(state: State): State;
}

export class AddTodoAction implements Action {
  static readonly TYPE = 'ADD_TODO';
  readonly type = AddTodoAction.TYPE;
  public todo: Todo;
  constructor(task: string) {
    this.todo = new Todo(nanoid(), task);
  }
  public static apply(state: State, action: AddTodoAction): State {
    return {
      ...state,
      todos: [...state.todos, action.todo]
    };
  }
}

export class UpdateTodoAction implements Action {
  static readonly TYPE = 'UPDATE_TODO_STATUS';
  readonly type = UpdateTodoAction.TYPE;
  constructor(public todo: Todo, public complete: boolean) {}
  public static apply(state: State, action: UpdateTodoAction): State {
    return {
      ...state,
      todos: state.todos.map(todo =>
          todo.id === action.todo.id
              ? { ...action.todo, complete: action.complete }
              : todo
      )
    };
  }
}

export class UpdateTodoValueAction implements Action {
  static readonly TYPE = 'UPDATE_TODO_VALUE';
  readonly type = UpdateTodoValueAction.TYPE;
  constructor(public todo: Todo, public task: string) {}
  public static apply(state: State, action: UpdateTodoValueAction): State {
    return {
      ...state,
      todos: state.todos.map(todo =>
          todo.id === action.todo.id
              ? { ...action.todo, task: action.task }
              : todo
      )
    };
  }
}

export class UpdateFilterAction implements Action {
  static readonly TYPE = 'UPDATE_FILTER';
  readonly type = UpdateFilterAction.TYPE;
  constructor(public filter: VisibilityFilter) {}
  public static apply(state: State, action: UpdateFilterAction): State {
    return {
        ...state,
        filter: action.filter
    };
  }
}

export class ClearCompletedAction implements Action {
  static readonly TYPE = 'CLEAR_COMPLETED';
  readonly type = ClearCompletedAction.TYPE;
  public static apply(state: State): State {
    return {
      ...state,
      todos: state.todos.filter(todo => !todo.complete)
    };
  }
}

//type ApplyFunctionType = (state: State) => State;



export type Actions =
  | AddTodoAction
  | UpdateTodoAction
  | UpdateFilterAction
  | UpdateTodoValueAction
  | ClearCompletedAction;
