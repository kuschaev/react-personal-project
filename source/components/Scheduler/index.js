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
        operationInProgress: false,
        findString:          '',
        taskMessage:         '',
        tasks:               [],
    };

    componentDidMount () {
        this._fetchTasks();
    }

    _setOperationInProgress = (state) => {
        this.setState({
            operationInProgress: state,
        });
    };

    _createTask = async () => {
        const { taskMessage } = this.state;

        // TODO: a more complex check
        if (taskMessage !== '') {
            this._setOperationInProgress(true);

            const newTask = new BaseTaskModel(v4(), false, false, taskMessage);
            const task = await api.createTask(newTask);

            this.setState(({ tasks }) => ({
                taskMessage: '',
                tasks:       sortTasksByGroup([task, ...tasks]),
            }));

            this._setOperationInProgress(false);
        }
    };

    _fetchTasks = async () => {
        this._setOperationInProgress(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks: sortTasksByGroup(tasks),
        });

        this._setOperationInProgress(false);
    };

    _updateTask = async (task) => {
        this._setOperationInProgress(true);

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

        this._setOperationInProgress(false);
    };

    _removeTask = async (id) => {
        this._setOperationInProgress(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));

        this._setOperationInProgress(false);
    };

    _completeAllTasks = async () => {
        this._setOperationInProgress(true);
        const { tasks } = this.state;

        tasks.forEach((task) => task.completed = true);
        // A very dirty hack
        // TODO: this must be done the React way, via lifecycle methods
        this.setState({ tasks: []});

        const updatedTasks = await api.completeAllTasks(tasks);

        this.setState({
            tasks: sortTasksByGroup(updatedTasks),
        });

        this._setOperationInProgress(false);
    };

    _handleInputChange = (event) => {
        this.setState({
            taskMessage: event.target.value,
        });
    };

    _updateTasksFilter = (event) => {
        const findString = event.target.value;

        this.setState({
            findString,
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
    };

    render () {
        const {
            tasks,
            taskMessage,
            operationInProgress,
            findString,
        } = this.state;

        // console.log('tasks from render', tasks);

        const filteredTasks = tasks.filter((task) =>
            task.message.toLowerCase().includes(findString.toLowerCase())
        );

        const tasksJSX = filteredTasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTask = { this._removeTask }
                    _updateTask = { this._updateTask }
                />
            );
        });

        return (
            <>
                <Spinner isSpinning = { operationInProgress } />
                <section className = { Styles.scheduler }>
                    <main>
                        <header>
                            <h1>Планировщик задач</h1>
                            <input
                                placeholder = 'Поиск'
                                type = 'search'
                                value = { findString }
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
                                    onChange = { this._handleInputChange }
                                />
                                <button onClick = { this._createTask }>
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
                                onClick = { this._completeAllTasks }
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
