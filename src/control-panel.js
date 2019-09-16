import {Dispatcher} from './flux';
import {Store} from './flux';

const controlPanelDispatcher = new Dispatcher();
const UPDATE_USERMAME = 'UPDATE_USERMAME';
const UPDATE_FONTSIZE = 'UPDATE_FONTSIZE';

const userNameUpdateAction = (name) => {
    return {
        type: UPDATE_USERMAME,
        value: name
    }
};

const fontSizeUpdateAction = (name) => {
    return {
        type: UPDATE_FONTSIZE,
        value: name
    }
};


document.getElementById('userNameInput').addEventListener('input', ({target}) => {
    const name = target.value;
    console.log("Dispatching...", name);
    controlPanelDispatcher.dispatch(userNameUpdateAction(name));
})

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({target})=>{
        const size = target.value;
        controlPanelDispatcher.dispatch(fontSizeUpdateAction(size));
    })
})

class UserPrefsStore extends Store {
    getInitialState() {
        return localStorage['preferences'] ? JSON.parse(localStorage['preferences']) : {
            userName:'Edgar',
            fontSize: 'small',
        }
    }
    __onDispatch(action){
        switch(action.type){
            case UPDATE_USERMAME:
                this.__state.userName = action.value;
                this.__emitChange();
                break;
                case UPDATE_FONTSIZE:
                        this.__state.fontSize = action.value;
                        this.__emitChange();
                        break;
        }
    }
    getUserPreferences() {
        return this.__state;
    }
}

const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);
userPrefsStore.addListener((state) => {
    console.info('the current state is...', state);
    render(state);
    localStorage['preferences'] = JSON.stringify(state);
})

const render = ({userName, fontSize}) => {
    document.getElementById('userName').innerText = userName;
    document.getElementsByClassName('container')[0].style.fontSize = fontSize === 'small' ? '16px' : '24px';
    document.forms.fontSizeForm.fontSize.value = fontSize;
}

// controlPanelDispatcher.register(action => {
//     console.info("Received action...", action);
// })

render(userPrefsStore.getUserPreferences());
