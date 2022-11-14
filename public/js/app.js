import tasks from '../../data/tasks.js';

function renderTasks(tasks) {
    console.log('render task: ', tasks);
    /**
     * b1: lấy dom mà mình muốn cho task hiển thị ra
     * b2: Chuyển cấu trúc array -> dom (tr > td)
     *     - map, join
     * b3: Hiển thị ra.
     */

    const taskDodyEl = document.getElementById('task-body');
    /**
     * [
     *      { id: 1, name: 'Task 1', level: 'small' },
     *      { id: 2, name: 'Task 2', level: 'medium' },
     * ]
     *
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
    taskDodyEl.innerHTML = taskDOM;
}


renderTasks(tasks);
