// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import { BaseTaskModel } from '../../instruments';

export default class Scheduler extends Component {

    state = {
        taskMessage: '',
        tasks: [
            {
                id:        '12313434234',
                completed: false,
                favorite:  false,
                message:   'Сделать дз'
            },
            {
                id:        '12313434243',
                completed: false,
                favorite:  false,
                message:   'Купить молоко',
            },
            {
                id:        '12313434278',
                completed: false,
                favorite:  false,
                message:   'Позвонить маме'
            }
        ],
    }

    _createTask = () => {
        const { taskMessage } = this.state;
        const newTask = new BaseTaskModel(undefined, undefined, undefined, taskMessage);

        this.setState(({ tasks }) => ({
            taskMessage: '',
            tasks: [newTask, ...tasks],
        }));
    }

    _removeTask = (id) => {
        this.setState((oldState) => ({
            tasks: oldState.tasks.filter(task => task.id !== id)
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
                        <input placeholder = 'Поиск' type = 'search' />
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
