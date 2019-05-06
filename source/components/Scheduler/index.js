// Core
import React, { Component } from 'react';

// Components
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { BaseTaskModel } from '../../instruments';
import { v4 } from 'uuid';

export default class Scheduler extends Component {

    state = {
        taskMessage: '',
        tasks: [
            {
                id:        v4(),
                completed: false,
                favorite:  false,
                message:   'Сделать дз',
            },
            {
                id:        v4(),
                completed: false,
                favorite:  false,
                message:   'Купить молоко',
            },
            {
                id:        v4(),
                completed: false,
                favorite:  false,
                message:   'Позвонить маме',
            }
        ],
    }

    componentDidMount () {
        this._fetchTasks();
    }

    _fetchTasks = async () => {
        // TODO: set spinner on action
        const response = await fetch(api.url, {
            method:  'GET',
            headers: {
                'Authorization': api.token,
            },
        });

        const { data: tasks } = await response.json();

        this.setState({ tasks });
    }

    _createTask = async () => {
        // TODO: set spinner on action
        const { taskMessage } = this.state;

        // TODO: a more complex check
        if (taskMessage !== '') {
            const newTask = new BaseTaskModel(v4(), false, false, taskMessage);

            const response = await fetch(api.url, {
                method:  'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': api.token,
                },
                body: JSON.stringify(newTask),
            });

            const { data: task } = await response.json();

            this.setState(({ tasks }) => ({
                taskMessage: '',
                tasks:       [task, ...tasks],
            }));
        }
    }

    _removeTask = async (id) => {
        // TODO: set spinner on action
        const deleteUrl = `${api.url}/${id}`;

        await fetch(deleteUrl, {
            method:  'DELETE',
            headers: {
                'Authorization': api.token,
            },
        });

        this.setState(({ tasks }) => ({
            tasks: tasks.filter(task => task.id !== id)
        }));
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
        const { tasks, taskMessage } = this.state;
        const tasksJSX = tasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTask = { this._removeTask }
                />
            );
        });

        return (
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
        );
    }
}
