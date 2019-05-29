import {Todo} from './todo';
import {VisibilityFilter} from './visibility-filter';

export class State {
    constructor(
        public task: string = '',
        public todos: Todo[] = [],
        public filter: VisibilityFilter = VisibilityFilter.SHOW_ALL
    ) {}
}
