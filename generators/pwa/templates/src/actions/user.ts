// noinspection SpellCheckingInspection
import nanoid from 'nanoid';
import {Action} from 'redux';

import {User} from '../models/user';
import {Role} from '../models/role';

import {State} from '../models/state';

import {ApplyAction, actionMap} from '../redux/reducer';

export const InputActions = {
    Filter: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:FILTER';
        public readonly type = ActionClass.TYPE;

        // noinspection JSUnusedGlobalSymbols
        constructor(public filter: Role) {}

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                return {
                    ...state,
                    view: {
                        ...state.view,
                        user: {
                            ...state.view.user,
                            filter: action.filter
                        }
                    }
                };
            });
        }
    },
    Name: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:NAME';
        public readonly type = ActionClass.TYPE;

        // noinspection JSUnusedGlobalSymbols
        constructor(public name: string) {}

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                return {
                    ...state,
                    view: {
                        ...state.view,
                        user: {
                            ...state.view.user,
                            name: action.name
                        }
                    }
                };
            });
        }
    },
    Role: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:ROLE';
        public readonly type = ActionClass.TYPE;

        // noinspection JSUnusedGlobalSymbols
        constructor(public role: Role) {}

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                return {
                    ...state,
                    view: {
                        ...state.view,
                        user: {
                            ...state.view.user,
                            role: action.role
                        }
                    }
                };
            });
        }
    },
    Enabled: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:ENABLED';
        public readonly type = ActionClass.TYPE;

        // noinspection JSUnusedGlobalSymbols
        constructor(public enabled: boolean) {}

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                return {
                    ...state,
                    view: {
                        ...state.view,
                        user: {
                            ...state.view.user,
                            enabled: action.enabled
                        }
                    }
                };
            });
        }
    }
};

export const UserActions = {
    Add: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:ADD';
        public readonly type = ActionClass.TYPE;
        public user: User;

        // noinspection JSUnusedGlobalSymbols
        constructor(name: string, role: Role, enabled: boolean) {
            this.user = new User(nanoid(), name, role, enabled);
        }

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                return {
                    ...state,
                    users: [...state.users, action.user]
                };
            });
        }
    },
    Delete: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:DELETE';
        public readonly type = ActionClass.TYPE;

        // noinspection JSUnusedGlobalSymbols
        constructor(public user: User) {}

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                return {
                    ...state,
                    users: state.users.filter((user) => (user.id !== action.user.id))
                };
            });
        }
    },
    Update: class ActionClass implements Action<string> {
        private static readonly TYPE = 'USER:UPDATE';
        public readonly type = ActionClass.TYPE;

        // noinspection JSUnusedGlobalSymbols
        constructor(public user: User) {}

        public static register(actionMap: Map<string, ApplyAction<State, ActionClass>>) {
            actionMap.set(ActionClass.TYPE, (state, action) => {
                console.log(ActionClass.TYPE, action.user)
                return {
                    ...state,
                    users: state.users.map((user) => (user.id === action.user.id ? action.user : user))
                };
            });
        }
    }
};

Object.values(InputActions).forEach(a=> a.register(actionMap));
Object.values(UserActions).forEach(a=> a.register(actionMap));
