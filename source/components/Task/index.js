// Core
import React, { PureComponent } from 'react';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            isTaskEditing:  false,
            newTaskMessage: props.message,
        };
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _toggleTaskCompletedState = () => {
        this.setState(
            (state, { completed }) => ({
                completed: !completed,
            }),
            this._updateTaskAsync
        );
    };

    _toggleTaskFavoriteState = () => {
        this.setState(
            (state, { favorite }) => ({
                favorite: !favorite,
            }),
            this._updateTaskAsync
        );
    };

    _handleTaskMessageChange = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _setTaskEditingState = () => {
        // A fallback option in case of esc press
        // or second task edit toggle
        if (!this.state.isTaskEditing) {
            this.savedMessage = this.props.message;
        }
        this.setState(({ isTaskEditing }) => {
            if (isTaskEditing) {
                return {
                    isTaskEditing:  !isTaskEditing,
                    newTaskMessage: this.savedMessage,
                };
            }

            return {
                isTaskEditing: !isTaskEditing,
            };
        }, this._setTaskInputFocus);
    };

    _handleInputDoubleClick = () => {
        if (!this.state.isTaskEditing) {
            this._setTaskEditingState();
        }
    };

    _updateTaskAsyncMessageOnKeyDown = (event) => {
        const enterKeyPressed = event.key === 'Enter' || event.keyCode === 13;
        const escapeKeyPressed = event.key === 'Escape' || event.keyCode === 27;

        if (enterKeyPressed) {
            this.setState(
                ({ isTaskEditing, newTaskMessage }) => ({
                    message:       newTaskMessage,
                    isTaskEditing: !isTaskEditing,
                }),
                this._updateTaskAsync
            );
        }

        if (escapeKeyPressed) {
            this.setState(({ isTaskEditing }) => ({
                newTaskMessage: this.savedMessage,
                isTaskEditing:  !isTaskEditing,
            }));
        }
    };

    _setTaskInputFocus = () => {
        this.taskInput.focus();
    };

    _updateTaskAsync = () => {
        const taskState = this._getTaskShape(this.state);
        const { _updateTaskAsync } = this.props;

        _updateTaskAsync([taskState]);
    };

    _removeTaskAsync = () => {
        const { id, _removeTaskAsync } = this.props;

        _removeTaskAsync(id);
    };

    render () {
        const { completed, favorite } = this.props;
        const { isTaskEditing, newTaskMessage } = this.state;

        return (
            <li
                className = {
                    completed
                        ? `${Styles.task} ${Styles.completed}`
                        : Styles.task
                }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#fff'
                        onClick = { this._toggleTaskCompletedState }
                    />
                    {/* Обертка вокруг дизебленого инпута, для активации по дабл клику */}
                    <div onDoubleClick = { this._handleInputDoubleClick }>
                        <input
                            disabled = { !isTaskEditing }
                            maxLength = '50'
                            ref = { (input) => {
                                this.taskInput = input;
                            } }
                            type = 'text'
                            value = { newTaskMessage }
                            onChange = { this._handleTaskMessageChange }
                            onKeyDown = { this._updateTaskAsyncMessageOnKeyDown }
                        />
                    </div>
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._setTaskEditingState }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTaskAsync }
                    />
                </div>
            </li>
        );
    }
}
