import Task from '../models/task.js';
import levelMap from '../config/constants.js';

const tasks = [
    new Task(1, 'task A', levelMap.key.small),
    new Task(2, 'task B', levelMap.key.medium),
    new Task(3, 'task C', levelMap.key.hight),
    new Task(4, 'task D', levelMap.key.hight),
    new Task(5, 'task E', levelMap.key.hight),
    new Task(6, 'task F', levelMap.key.hight),
];

/**
 * small < medium < high
 *
 * desc: small < medium < high
 * asc: hight < medium < small
 */

export default tasks;
