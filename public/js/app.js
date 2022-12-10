import __task__ from '../../data/tasks.js';
import { colorLevel, levelMap } from '../../config/constants.js';
import Task from '../../models/task.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const sortType = {
    orderBy: 'name',
    orderDir: 'desc',
}
const dataFromLocalStorage = getDataFromLocalStorage();
const inputSortEl = document.querySelector('.sort-values');
const controlsFormEl = document.querySelector('.controls-form');
const buttonToggleFormEl = document.querySelector('.button-toggle-form');
const inputNameEl = document.querySelector('.input-name');
const inputLevelEl = document.querySelector('.input-level');
const inputSearch = document.querySelector('[name=search-result]');
let TASK_DATA = [...dataFromLocalStorage];
let taskEditSelected = null;
let searchString = '';

buttonToggleFormEl.addEventListener('click', function() {
    controlsFormEl.classList.contains('hidden')
    ? handleForm().open()
    : handleForm().close();
});

inputSearch.addEventListener('keyup', function(event) {
    searchString = event.target.value.toLowerCase();
    handleFilterTasks(searchString, sortType.orderBy, sortType.orderDir);
});

inputSortEl.addEventListener('change', function({ target: { value } }) {
    const valSort = value.split('-');
    sortType.orderBy = valSort[0];
    sortType.orderDir = valSort[1];
    handleFilterTasks(searchString, sortType.orderBy, sortType.orderDir);
});

function getDataFromLocalStorage() {
    const data = localStorage.getItem('list_tasks');
    // Hạn chế dùng toán tử phủ định để so sánh.
    return data ? JSON.parse(data) : [];
}

function storeLocalStorage(data) {
    localStorage.setItem('list_tasks', JSON.stringify(data));
}

function renderTasks(tasks) {
    const taskBodyEl = document.getElementById('task-body');
    const taskFormatted = tasks.map(function(task, index) {
        return `<tr>
                    <td>${index + 1}</td>
                    <td>${task.name}</td>
                    <td>
                        <span
                            class="span"
                            style="background-color: ${colorLevel[task.level]};"
                        >
                            ${levelMap.label[task.level]}
                        </span>
                    </td>
                    <td>
                        <button type="button" class="btn-delete" data-task-id="${task.id}">Delete</button>
                        <button type="button" class="btn-edit" data-task-id="${task.id}">Edit</button>
                    </td>
                </tr>`;
    });

    const taskDOM = taskFormatted.join('');
    taskBodyEl.innerHTML = taskDOM;
}

function handleForm() {
    return {
        close: function() {
            controlsFormEl.classList.add('hidden');
            buttonToggleFormEl.innerText = 'SHOW FORM';
            buttonToggleFormEl.style.backgroundColor = 'rgb(27, 62, 62)';
        },
        open: function() {
            controlsFormEl.classList.remove('hidden');
            buttonToggleFormEl.innerText = 'HIDDEN FORM';
            buttonToggleFormEl.style.backgroundColor = 'red';
        }
    };
}

function deleteHandler() {
    const btnDeleteEls = document.querySelectorAll('.btn-delete');
    btnDeleteEls.forEach(function(btnItem) {
        btnItem.addEventListener('click', function() {
            const confirmDelete = confirm('Bạn có chắn muốn xóa task này?');
            if (confirmDelete) {
                const taskID = this.getAttribute('data-task-id');
                const newTask = TASK_DATA.filter(function(task) {
                    return task.id !== taskID;
                });
                TASK_DATA = newTask;
                handleDataInitialization();
            }
        });
    });
}

function addNewTask() {
    const submitButtonEl = document.getElementById('submit-form');
    submitButtonEl.addEventListener('click', function() {
        const inputNameVal = inputNameEl.value;
        const inputLevelVal = inputLevelEl.value;
        if (!inputNameVal.trim().length) {
            alert('Vui lòng nhập tên task');
        } else {
            if (taskEditSelected === null) {
                // Add new task
                const newTask = new Task(uuidv4(), inputNameVal, +inputLevelVal);
                TASK_DATA.push(newTask);
                handleDataInitialization();
            } else {
                // Update task selected
                const newTask = new Task(taskEditSelected.id, inputNameVal, +inputLevelVal);
                const taskIndexFound = TASK_DATA.findIndex(function(taskItem) {
                    return taskItem.id === taskEditSelected.id;
                });
                TASK_DATA[taskIndexFound] = newTask;
                handleDataInitialization();
            }
            assignValueToForm('', 1);
            handleForm().close();
        }
    });
}

function handleDataInitialization() {
    storeLocalStorage(TASK_DATA);
    handleFilterTasks(searchString, sortType.orderBy, sortType.orderDir);
}

function editTask() {
    const btnDeleteEls = document.querySelectorAll('.btn-edit');
    btnDeleteEls.forEach(function(btnItem) {
        btnItem.addEventListener('click', function() {
            const taskID = this.getAttribute('data-task-id');
            const taskIndexFound = TASK_DATA.findIndex(function(taskItem) {
                return taskItem.id === taskID;
            });
            taskEditSelected = TASK_DATA[taskIndexFound];
            assignValueToForm(taskEditSelected.name, taskEditSelected.level);
            handleForm().open();
        });
    });
}

function assignValueToForm(name, level) {
    inputNameEl.value = name;
    inputLevelEl.value = level;
}

function handleSearch(searchString, tasks) {
    if (!searchString.trim().length) return tasks;
    return tasks.filter(function(task) {
        return task.name.toLowerCase().includes(searchString);
    });
}

function handleSort(orderBy, orderDir, tasks) {
    if (orderBy === 'name') {
        const tasksCopy = tasks.sort(function(a, b) {
            if (a.name > b.name) {
                return orderDir === 'asc' ? -1 : 1;
            } else if (a.name < b.name) {
                return orderDir === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        });
        return tasksCopy;
    }

    if (orderBy === 'level') {
    }
}

function handleFilterTasks(searchString, orderBy, orderDir) {
    const tasksSearched = handleSearch(searchString, TASK_DATA);
    const tasksSorted = handleSort(orderBy, orderDir, tasksSearched);
    renderTasks(tasksSorted);
    deleteHandler();
    editTask();
}

handleFilterTasks(searchString, sortType.orderBy, sortType.orderDir);
handleForm().close();
deleteHandler();
addNewTask();
editTask();
