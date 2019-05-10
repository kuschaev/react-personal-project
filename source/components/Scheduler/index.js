// Core
import React, { Component } from 'react';

// Components
import Task from '../Task';
import Spinner from '../Spinner';
import Checkbox from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { BaseTaskModel, sortTasksByGroup } from '../../instruments';
import { v4 } from 'uuid';

export default class Scheduler extends Component {
    state = {
        isTasksFetching: false,
        tasksFilter:     '',
        taskMessage:     '',
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _createTaskAsync = async () => {
        const { taskMessage } = this.state;

        // TODO: a more complex check
        if (taskMessage !== '') {
            this._setTasksFetchingState(true);

            const newTask = new BaseTaskModel(v4(), false, false, taskMessage);
            const task = await api.createTask(newTask);

            this.setState(({ tasks }) => ({
                taskMessage: '',
                tasks:       sortTasksByGroup([task, ...tasks]),
            }));

            this._setTasksFetchingState(false);
        }
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks: sortTasksByGroup(tasks),
        });

        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (task) => {
        this._setTasksFetchingState(true);

        const updatedTask = await api.updateTask(task);

        this.setState(({ tasks }) => {
            const updatedTaskList = tasks.map(
                (currTask) =>
                    updatedTask.find((ut) => ut.id === currTask.id) || currTask
            );

            return {
                taskMessage: '',
                tasks:       sortTasksByGroup(updatedTaskList),
            };
        });

        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));

        this._setTasksFetchingState(false);
    };

    _completeAllTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const { tasks } = this.state;

        const uncompletedTasks = tasks.filter(
            (task) => task.completed === false
        );

        uncompletedTasks.forEach((task) => task.completed = true);

        const updatedTasks = await api.completeAllTasks(uncompletedTasks);
        const updatedTaskList = tasks.map(
            (currTask) =>
                updatedTasks.find((ut) => ut.id === currTask.id) || currTask
        );

        this.setState({
            tasks: sortTasksByGroup(updatedTaskList),
        });

        this._setTasksFetchingState(false);
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;
        const completed = tasks.filter((task) => task.completed === true);

        return completed;
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            taskMessage: event.target.value,
        });
    };

    _updateTasksFilter = (event) => {
        const tasksFilter = event.target.value;

        this.setState({
            tasksFilter,
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
    };

    render () {
        const { tasks, taskMessage, isTasksFetching, tasksFilter } = this.state;

        // console.log('tasks from render', tasks);

        const filteredTasks = tasks.filter((task) =>
            task.message.toLowerCase().includes(tasksFilter.toLowerCase())
        );

        const tasksJSX = filteredTasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            );
        });

        return (
            <>
                <Spinner isSpinning = { isTasksFetching } />
                <section className = { Styles.scheduler }>
                    <main>
                        <header>
                            <h1>Планировщик задач</h1>
                            <input
                                placeholder = 'Поиск'
                                type = 'search'
                                value = { tasksFilter }
                                onChange = { this._updateTasksFilter }
                            />
                        </header>
                        <section>
                            <form onSubmit = { this._handleFormSubmit }>
                                <input
                                    maxLength = '50'
                                    placeholder = 'Описание новой задачи'
                                    type = 'text'
                                    value = { taskMessage }
                                    onChange = { this._updateNewTaskMessage }
                                />
                                <button onClick = { this._createTaskAsync }>
                                    Добавить задачу
                                </button>
                            </form>
                            <div>
                                <ul>
                                    {/* <div style = { { position: 'relative' } }> */}
                                    {tasksJSX}
                                    {/* </div> */}
                                </ul>
                            </div>
                        </section>
                        <footer>
                            <Checkbox
                                inlineBlock
                                checked = {
                                    !tasks.some(
                                        (task) => task.completed === false
                                    )
                                }
                                className = { Styles.toggleTaskFavoriteState }
                                color1 = '#000'
                                color2 = '#fff'
                                onClick = { this._completeAllTasksAsync }
                            />
                            <span className = { Styles.completeAllTasks }>
                                Все задачи выполнены
                            </span>
                        </footer>
                    </main>
                </section>
            </>
        );
    }
}
