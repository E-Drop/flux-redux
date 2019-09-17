import { Store } from './Store';
export class ReduceStore extends Store {
    constructor(dispatcher) {
        super(dispatcher);
        this.__history = [];
    }
    reduce(state, action) {
        throw new Error('subclasses must implement reduce method of a Flux ReduceStore');
    }

    // In Store.js we overwrite _onDispatch function an make the Switch in the class object
    // Now onDispatch is callign reduce that is overwrited in class object,
    // but reduce is making a copy of the state, not mutating directly
    __onDispatch(action) {
        const newState = this.reduce(this.__state, action);
        if (newState !== this.__state) {
            this.__history.push(this.__state);
            this.__state = newState;
            this.__emitChange();
        }
    }

    revertLastState(){
        if(this.__history.length > 0) {
            this.__state = this.__history.pop();
        }
        this.__emitChange();
    }
}
