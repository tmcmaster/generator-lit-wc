import {State} from "../models/state";
import {createSelector} from "reselect";
import {Role} from "../models/role";

const getUsersSelector = (state: State) => state.users;
const getRoleFilterSelector = (state: State) => state.view.user.filter;

const getVisibleUsersSelector = createSelector(
    getUsersSelector,
    getRoleFilterSelector,
    (users, filter) => {
        return users.filter(user => filter === Role.ALL || user.role === filter);
    }
);

export const selector = {
    user: {
        all: getUsersSelector,
        filtered: getVisibleUsersSelector
    }
};