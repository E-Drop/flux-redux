import {Dispatcher} from './flux';
import {Store} from './flux';

const controlPanelDispatcher = new Dispatcher();

document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log("Dispatching...", name);
    controlPanelDispatcher.dispatch('TODO_NAME_ACTION');
})

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({target})=>{
        controlPanelDispatcher.dispatch('TODO_FONT_ACTION');
    })
})

class UserPrefsStore extends Store {
    getInitialState() {
        return {
            userName:'Edgar',
            fontSize: 'small',
        }
    }
    __onDispatch(action){
        console.log('Store is ready to dispatch', action);
        this.__emitChange();
    }
    getUserPreferences() {
        return this.__state;
    }
}

const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);
userPrefsStore.addListener((state) => {
    console.info('the current state is...', state);
})

controlPanelDispatcher.register(action => {
    console.info("Received action...", action);
})
