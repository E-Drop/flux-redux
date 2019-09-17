import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore } from './flux';

// Create an instance of the class Dispatcher
const tasksDispatcher =  new Dispatcher();

// Define action Types
const CREATE_TASK = 'CREATE_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';
const SHOW_TASKS = 'SHOW_TASKS';

// Define Actions
const createNewTaskAction = (content) => {
    return {
        type: CREATE_TASK,
        value: content
    }
};
const showTasksAction = (show) => {
    return {
        type: SHOW_TASKS,
        value: show
    }
};
const completeTaskAction = (id, isComplete) => {
    return {
        type: COMPLETE_TASK,
        id,
        value: isComplete
    }
};

// Add events listeners to fomrs fields to dispatch actions onchange/onsubmit
document.forms.newTask.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.newTaskName.value;
    if (name) {
        tasksDispatcher.dispatch(createNewTaskAction(name));
        e.target.newTaskName.value = null;
    }
})

document.getElementById('showComplete').addEventListener('change', ({target}) => {
    const showComplete = target.checked;
    tasksDispatcher.dispatch(showTasksAction(showComplete));
})

// Create a class Store making an override of the abstracts methods defined in Store.js
class TaskStore extends ReduceStore {
    getInitialState(){
        return {
            tasks: [
                {
                    id: id(),
                    content: 'Learn how Flux works',
                    complete: false,
                },
                {
                    id: id(),
                    content: 'Create Dispatcher',
                    complete: false,
                },
                {
                    id: id(),
                    content: 'Create Action',
                    complete: false,
                },
                {
                    id: id(),
                    content: 'Create Reducer',
                    complete: true,
                },
            ],
            showComplete: true,
        }
    }
    reduce(state, action) {
        console.info('reducing...', state, action);
        return state;
    }
    getState() {
        return this.__state;
    }
}

const TaskComponent = ({content, complete, id}) => (
    `<section>
        ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${complete ? "checked" : ""}>
    </section>`
)

const render = () => {
    const taskSection = document.getElementById('tasks');
    const state = tasksStore.getState();
    const rendered = state.tasks.filter(task => state.showComplete ? true : !task.complete).map(TaskComponent).join("");
    taskSection.innerHTML = rendered;
}

// Make an instance of the custom Store defined up
const tasksStore = new TaskStore(tasksDispatcher);

tasksDispatcher.dispatch('TEST_DISPATCH');
render();
