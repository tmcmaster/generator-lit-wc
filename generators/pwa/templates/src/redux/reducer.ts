import {State} from "../models/state";
import {Action} from "redux";

export type ApplyAction<S, A> = (state: S, action: A) => State;

export const actionMap = new Map<string, ApplyAction<State, Action>>();

export const reducer = (state = new State(), action: Action): State => {
    return (actionMap.get(action.type) ? actionMap.get(action.type)!(state, action) : state);
};
