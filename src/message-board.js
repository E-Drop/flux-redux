import { createStore, combineReducers } from 'redux';

// Define action types
export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';

// Define actions
const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}

const createMessageAction = (content,postedBy) => {
    const date = new Date();
    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
}

// Define default State of the store app
const defaultState = {
    messages: [
        {
            date: new Date('2019-04-05'),
            postedBy: 'Dan Abramov',
            content: 'I <3 the new productivity app!',
        },
        {
            date: new Date(),
            postedBy: 'Daniel Sterling',
            content: 'I hate the new productivity app!',
        },
    ],
    userStatus: ONLINE
}

// Define Reducers
const userStatusReducer = ( state = defaultState.userStatus, {type, value}) => {
    switch(type) {
        case UPDATE_STATUS:
            return value;
            break;
    }
    return state;
}

const messagesReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
    switch(type){
        case CREATE_NEW_MESSAGE:
            const newState = [{date, postedBy, content: value}, ...state];
            return newState;
        }
        return state;
    }


// Combine Reducers
const combinedReducers = combineReducers({
    userStatus: userStatusReducer,
    messages: messagesReducer,
});


// Create store and pass all the reducers
const store = createStore(combinedReducers);

// Create render method that introduce all the messages in store state.messages
// empty the input text of messages, and disable messages form for userstatus offline
const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages.sort((a,b) => b.date - a.date).map(message => (
        `<div>
        ${message.postedBy} : ${message.content}
        </div>`
    )).join("");

    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
    document.forms.newMessage.newMessage.value = '';
}

// Create eventListener that dispatch actions
document.forms.selectStatus.status.addEventListener('change', (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});

document.forms.newMessage.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).userName : 'Jhon Doe';
    store.dispatch(createMessageAction(value, username));
})

// the subscribe function add a listener that is listening changes
// every time that an action is dispatched ejecutes the callback function, render in this case
store.subscribe(render);

render();
