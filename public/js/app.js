import __tasks__ from '../../data/tasks.js';

/**
 * name: anh muốn sắp xếp theo name.
 * desc: sắp xếp tăng dần
 */
const sortType = {
    orderBy: 'name',
    orderDir: 'desc',
}
const inputSortEl = document.querySelector('.sort-values');

inputSortEl.addEventListener('change', function(e) {
    const val = e.target.value;
    const valSort = val.split('-');
    sortType.orderBy = valSort[0];
    sortType.orderDir = valSort[1];
    sortHandler(sortType.orderBy, sortType.orderDir);
});

function renderTasks(tasks) {
    console.log('render task: ', tasks);
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

    const taskFormatted = tasks.map(function(task) {
        return `<tr>
                    <td>${task.id}</td>
                    <td>${task.name}</td>
                    <td><span class="span">${task.level}</span></td>
                    <td>
                        <button type="button">Delete</button>
                        <button type="button">Edit</button>
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
        const newTasks = __tasks__.filter(function(task) {
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
        const tasksCopy = [...__tasks__].sort(function(a, b) {
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

renderTasks(__tasks__);
toggleForm();
search();
sortHandler(sortType.orderBy, sortType.orderDir);

