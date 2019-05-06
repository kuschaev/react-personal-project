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
        taskMessage:         '',
        tasks:               [],
    }

    componentDidMount () {
        this._fetchTasks();
    }

    _setOperationInProgress = (state) => {
        this.setState({
            operationInProgress: state,
        });
    }

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
    }

    _fetchTasks = async () => {
        this._setOperationInProgress(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks: sortTasksByGroup(tasks),
        });

        this._setOperationInProgress(false);
    }

    _updateTask = async (task) => {
        this._setOperationInProgress(true);

        const updatedTask = await api.updateTask(task);

        this.setState(({ tasks }) => {
            const updatedTaskList = tasks.map(task => updatedTask.find(ut => ut.id === task.id) || task);

            return {
                taskMessage: '',
                tasks:       sortTasksByGroup(updatedTaskList),
            };
        });

        this._setOperationInProgress(false);
    }

    _removeTask = async (id) => {
        this._setOperationInProgress(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks: tasks.filter(task => task.id !== id),
        }));

        this._setOperationInProgress(false);
    }

    _handleInputChange = (event) => {
        this.setState({
            taskMessage: event.target.value,
        });
    }

    _handleFormSubmit = (event) => {
        event.preventDefault();
    }

    render () {
        const { tasks, taskMessage, operationInProgress } = this.state;
        const tasksJSX = tasks.map((task) => {
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

                            />
                        </header>
                        <section>
                            <form
                                onSubmit = { this._handleFormSubmit }>
                                <input
                                    maxLength = '50'
                                    placeholder = 'Описание новой задачи'
                                    type = 'text'
                                    value = { taskMessage }
                                    onChange = { this._handleInputChange }
                                />
                                <button
                                    onClick = { this._createTask }>
                                    Добавить задачу
                                </button>
                            </form>
                            <div>
                                <ul>
                                    {/* <div style = { { position: 'relative' } }> */}
                                    { tasksJSX }
                                    {/* </div> */}
                                </ul>
                            </div>
                        </section>
                        <footer>
                            <Checkbox
                                inlineBlock
                                className = { Styles.toggleTaskFavoriteState }
                                color1 = '#000'
                                color2 = '#fff'
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
