import { createStore } from 'redux';

export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';
export const UPDATE_STATUS = 'UPDATE_STATUS';

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

const reducer = ( state = defaultState, { type, value} ) => {
    switch(type) {
        case UPDATE_STATUS:
            return {...state, userStatus: value};
            break;
    }
    return state;
}

const store = createStore(reducer);

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages.sort((a,b) => b.date - a.date).map(message => (
        `<div>
        ${message.postedBy} : ${message.content}
        </div>`
    )).join("");

    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
}

document.forms.selectStatus.status.addEventListener('change', (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}

store.subscribe(render);

render();
