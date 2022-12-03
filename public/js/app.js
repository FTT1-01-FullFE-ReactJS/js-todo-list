import __task__ from '../../data/tasks.js';
import levelMap from '../../config/constants.js';
import Task from '../../models/task.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

/**
 * name: anh muốn sắp xếp theo name.
 * desc: sắp xếp tăng dần
 */
const sortType = {
    orderBy: 'name',
    orderDir: 'desc',
}
let TASK_DATA = [...getDataFromLocalStorage()];
let taskEditSelected = null;

const inputSortEl = document.querySelector('.sort-values');

inputSortEl.addEventListener('change', function(e) {
    const val = e.target.value;
    const valSort = val.split('-');
    sortType.orderBy = valSort[0];
    sortType.orderDir = valSort[1];
    sortHandler(sortType.orderBy, sortType.orderDir);
});


function getDataFromLocalStorage() {
    const data = localStorage.getItem('list_tasks');
    return JSON.parse(data);
}

function storeLocalStorage(data) {
    // typeof data = array
    // b1: chuyển array -> string
    localStorage.setItem('list_tasks', JSON.stringify(data));
}

function getColorByTaskLevel(level) {
    if (level === levelMap.key.small) {
        return '#00cc74';
    } else if (level === levelMap.key.medium) {
        return 'yellow';
    } else if (level === levelMap.key.hight) {
        return 'red';
    } else {
        throw new Error(`Task level ${level} không hợp lệ`);
    }
}

function renderTasks(tasks) {
    /**
     * b1: lấy dom mà mình muốn cho task hiển thị ra
     * b2: Chuyển cấu trúc array -> dom (tr > td)
     *     - map, join
     * b3: Hiển thị ra.
     */

    const taskBodyEl = document.getElementById('task-body');
    /**
     * [
     *      { id: 1, name: 'Task 1', level: 'small' },
     *      { id: 2, name: 'Task 2', level: 'medium' },
     * ]
     *
     * [
     *      <tr> <td>1</td> <td>Task 1</td> <td>small</td>/tr>,
     *      <tr> <td>2</td> <td>Task 2</td> <td>medium</td>/tr>,
     * ]
     */

    const taskFormatted = tasks.map(function(task, index) {
        return `<tr>
                    <td>${index + 1}</td>
                    <td>${task.name}</td>
                    <td>
                        <span
                            class="span"
                            style="background-color: ${getColorByTaskLevel(task.level)};"
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

function toggleForm() {
    const controlsFormEl = document.querySelector('.controls-form');
    const buttonToggleFormEl = document.querySelector('.button-toggle-form');
    controlsFormEl.classList.add('hidden');

    buttonToggleFormEl.addEventListener('click', function() {
        if (controlsFormEl.classList.contains('hidden')) {
            controlsFormEl.classList.remove('hidden');
            this.style.backgroundColor = 'red';
            this.innerText = 'HIDDEN FORM';
        } else {
            controlsFormEl.classList.add('hidden');
            this.style.backgroundColor = 'rgb(27, 62, 62)';
            this.innerText = 'SHOW FORM';
        }
    });
}

function search() {
    /**
     * b1: Bắt được sự kiện khi user nhập ký tự.
     * b2: Lấy được giá trị mà người dùng nhập
     * b3: So sách kết quả tìm kiếm và hiển thị ra kết quả.
     */
    const inputSearch = document.querySelector('[name=search-result]');
    inputSearch.addEventListener('keyup', function(event) {
        const valueSearch = event.target.value.toLowerCase();
        const newTasks = TASK_DATA.filter(function(task) {
            if (task.name.toLowerCase().includes(valueSearch)) {
                return true;
            } else {
                return false;
            }
        });

        renderTasks(newTasks);
    });
}

/**
 * const arr = [4, 2, 6, 1, 9]
 * desc: [1, 2, 4, 6, 9]
 * asc:  [9, 6, 4, 2, 1]
 * arr.sort(function(a, b) {
 *  // vong1: a = 4, b = 2;
 *  // Nếu muốn sắp xếp theo thứ tự tăng đần return -1
 *  // Nếu muốn sắp xếp theo thứ tự giảm dần return 1
 *  if (a > b) {
 *      return -1; [2, 4, 6, 1, 9]
 *  }
 *
 * // vong2: a = 4, b = 6;
 * if (a > b) {
 *
 * }
 * });
 *
 */

function sortHandler(orderBy, orderDir) {
    if (orderBy === 'name') {
        const tasksCopy = [...TASK_DATA].sort(function(a, b) {
            if (a.name > b.name) {
                return orderDir === 'asc' ? -1 : 1;
            } else if (a.name < b.name) {
                return orderDir === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        });
        renderTasks(tasksCopy);
    }

    if (orderBy === 'level') {
        console.log('Sort by level');
    }
}

function deleteHandler() {
    const btnDeleteEls = document.querySelectorAll('.btn-delete');
    btnDeleteEls.forEach(function(btnItem) {
        btnItem.addEventListener('click', function() {
            const confirmDelete = confirm('Bạn có chắn muốn xóa task này?');
            if (confirmDelete) {
                const taskID = this.getAttribute('data-task-id');
                // const taskID = btnItem.getAttribute('data-task-id');
                // tasks = [1, 2, 3, 4]
                // 2
                console.log({ taskID }); // '2' === 2 => false

                const newTask = TASK_DATA.filter(function(task) {
                    return task.id !== taskID;
                });

                TASK_DATA = newTask;
                storeLocalStorage(TASK_DATA);

                renderTasks(TASK_DATA); // render dom 2
                deleteHandler(); // delete data dom 2
                editTask();
            }
        });
    });
}

function addNewTask() {
    const submitButtonEl = document.getElementById('submit-form');
    submitButtonEl.addEventListener('click', function() {
        const inputNameEl = document.querySelector('.input-name');
        const inputLevelEl = document.querySelector('.input-level');
        const inputNameVal = inputNameEl.value;
        const inputLevelVal = inputLevelEl.value;

        // 0, null, undefined, false => boolean -> false
        if (!inputNameVal.trim().length) {
            alert('Vui lòng nhập tên task');
        } else {
            if (taskEditSelected === null) {
                // Add new task
                const newTask = new Task(uuidv4(), inputNameVal, +inputLevelVal);
                // what is push method?
                TASK_DATA.push(newTask);
                storeLocalStorage(TASK_DATA);
                renderTasks(TASK_DATA); // render dom 2
                deleteHandler(); // delete data dom 2
                editTask();

            } else {
                // Chú ý nghiên cứu kỹ
                const newTask = new Task(taskEditSelected.id, inputNameVal, +inputLevelVal);
                const taskIndexFound = TASK_DATA.findIndex(function(taskItem) {
                    return taskItem.id === taskEditSelected.id;
                });
                TASK_DATA[taskIndexFound] = newTask;
                storeLocalStorage(TASK_DATA);
                renderTasks(TASK_DATA);
                deleteHandler();
                editTask();
            }
            // Reset form
            inputNameEl.value = '';
            inputLevelEl.value = 1;

            // Hidden form
            const controlsFormEl = document.querySelector('.controls-form');
            const buttonToggleFormEl = document.querySelector('.button-toggle-form');
            controlsFormEl.classList.add('hidden');
            buttonToggleFormEl.style.backgroundColor = 'rgb(27, 62, 62)';
            buttonToggleFormEl.innerText = 'SHOW FORM';
        }
    });
}

function editTask() {
    const btnDeleteEls = document.querySelectorAll('.btn-edit');
    btnDeleteEls.forEach(function(btnItem) {
        btnItem.addEventListener('click', function() {
             // Chú ý nghiên cứu kỹ
            const taskID = this.getAttribute('data-task-id');
            const taskIndexFound = TASK_DATA.findIndex(function(taskItem) {
                return taskItem.id === taskID;
            });

            taskEditSelected = TASK_DATA[taskIndexFound];

            // // Append data to form
            const inputNameEl = document.querySelector('.input-name');
            const inputLevelEl = document.querySelector('.input-level');
            inputNameEl.value = taskEditSelected.name;
            inputLevelEl.value = taskEditSelected.level;

            // Open form
            const controlsFormEl = document.querySelector('.controls-form');
            const buttonToggleFormEl = document.querySelector('.button-toggle-form');
            controlsFormEl.classList.remove('hidden');
            buttonToggleFormEl.style.backgroundColor = 'red';
            buttonToggleFormEl.innerText = 'HIDDEN FORM';
        });
    });
}

renderTasks(TASK_DATA); // render dom 1
toggleForm();
search();
sortHandler(sortType.orderBy, sortType.orderDir);
deleteHandler(); // delete data dom 1
addNewTask();
editTask();
