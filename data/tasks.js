import Task from '../models/task.js';
import levelMap from '../config/constants.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tasks = [
    new Task(uuidv4(), 'task A', levelMap.key.small),
    new Task(uuidv4(), 'task B', levelMap.key.medium),
    new Task(uuidv4(), 'task C', levelMap.key.hight),
    new Task(uuidv4(), 'task D', levelMap.key.hight),
    new Task(uuidv4(), 'task E', levelMap.key.hight),
    new Task(uuidv4(), 'task F', levelMap.key.hight),
];

/**
 * small < medium < high
 *
 * desc: small < medium < high
 * asc: hight < medium < small
 */

export default tasks;
