// Core
import React, { Component } from 'react';

// Components
import Task from '../Task';
import Spinner from '../Spinner';
import Checkbox from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments';

export default class Scheduler extends Component {
    state = {
        isTasksFetching: false,
        tasksFilter:     '',
        newTaskMessage:  '',
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

    _createTaskAsync = async (event) => {
        const { newTaskMessage } = this.state;

        // TODO: a more complex check
        if (newTaskMessage) {
            if (event) {
                event.preventDefault();
            }
            this._setTasksFetchingState(true);

            let task;

            try {
                task = await api.createTask(newTaskMessage);
            } catch (error) {
                if (!task || !task.length) {
                    throw error;
                }
            }

            this.setState(({ tasks }) => ({
                newTaskMessage: '',
                tasks:          sortTasksByGroup([task, ...tasks]),
            }));

            this._setTasksFetchingState(false);
        } else {
            return null;
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

        let updatedTask;

        try {
            updatedTask = await api.updateTask(task);
        } catch (error) {
            if (!updatedTask || !updatedTask.length) {
                throw error;
            }
        }

        this.setState(({ tasks }) => {
            const updatedTaskList = tasks.map(
                (currTask) =>
                    updatedTask.find((updTask) => updTask.id === currTask.id) ||
                    currTask
            );

            return {
                newTaskMessage: '',
                tasks:          sortTasksByGroup(updatedTaskList),
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
        if (!this._getAllCompleted()) {
            const { tasks } = this.state;

            const uncompletedTasks = tasks.filter((task) => !task.completed);

            if (uncompletedTasks.length) {
                this._setTasksFetchingState(true);

                uncompletedTasks.forEach((task) => task.completed = true);

                let updatedTasks;

                try {
                    updatedTasks = await api.completeAllTasks(uncompletedTasks);
                } catch (error) {
                    if (
                        !updatedTasks ||
                        updatedTasks.length !== uncompletedTasks.length
                    ) {
                        throw error;
                    }
                }

                const updatedTaskList = tasks.map(
                    (currTask) =>
                        updatedTasks.find(
                            (updTask) => updTask.id === currTask.id
                        ) || currTask
                );

                this.setState({
                    tasks: sortTasksByGroup(updatedTaskList),
                });

                this._setTasksFetchingState(false);
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;
        const completed = !tasks.some((task) => !task.completed);

        return completed;
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _updateTasksFilter = (event) => {
        const tasksFilter = event.target.value.toLowerCase();

        this.setState({
            tasksFilter,
        });
    };

    render () {
        const {
            tasks,
            newTaskMessage,
            isTasksFetching,
            tasksFilter,
        } = this.state;

        const filteredTasks = tasks.filter((task) =>
            task.message.toLowerCase().includes(tasksFilter)
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
                            <form onSubmit = { this._createTaskAsync }>
                                <input
                                    maxLength = { 50 }
                                    placeholder = 'Описание новой задачи'
                                    type = 'text'
                                    value = { newTaskMessage }
                                    onChange = { this._updateNewTaskMessage }
                                />
                                <button onClick = { this._createTaskAsync }>
                                    Добавить задачу
                                </button>
                            </form>
                            <div>
                                <ul>{tasksJSX}</ul>
                            </div>
                        </section>
                        <footer>
                            <Checkbox
                                inlineBlock
                                checked = { !tasks.some((task) => !task.completed) }
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
