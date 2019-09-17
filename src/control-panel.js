import { Dispatcher, Store } from './flux';

// Create an instance of the class Dispatcher
const controlPanelDispatcher = new Dispatcher();

// Define action Types
const UPDATE_USERMAME = 'UPDATE_USERMAME';
const UPDATE_FONTSIZE = 'UPDATE_FONTSIZE';


// Define Actions
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

// Add events listeners to fomrs fields to dispatch actions onchange
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

// Create a class Store making an override of the abstracts methods defined in Store.js
class UserPrefsStore extends Store {
    getInitialState() {
        // check if local storage is empty to take static data of the specified object or take data from localStorage
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

// Make an instance of the custom Store defined up and add a listener in state to listeng changes an update localstorage
const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);
userPrefsStore.addListener((state) => {
    console.info('the current state is...', state);
    render(state);
    localStorage['preferences'] = JSON.stringify(state);
})

// Function that update the value of the forms with the data in the state
const render = ({userName, fontSize}) => {
    document.getElementById('userName').innerText = userName;
    document.getElementsByClassName('container')[0].style.fontSize = fontSize === 'small' ? '16px' : '24px';
    document.forms.fontSizeForm.fontSize.value = fontSize;
}

// Call the getUsersPreferences to fill data on start
render(userPrefsStore.getUserPreferences());
