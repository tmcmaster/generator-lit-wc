import { Role } from './role';
import { User } from '../models/user';

export class State {
    constructor(
        public users: User[] = [],
        public view: ViewState = new ViewState()
    ) {}
}

export class ViewState {
    constructor(
        public user: UserViewState = new UserViewState()
    ) {}
}

export class UserViewState {
    constructor(
        public name: string = '',
        public role: Role = Role.GUEST,
        public enabled: boolean = false,
        public filter: Role = Role.GUEST,
    ) {}
}