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

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };
    taskInput = React.createRef();

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
        const { completed, _updateTaskAsync } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _toggleTaskFavoriteState = () => {
        const { favorite, _updateTaskAsync } = this.props;

        _updateTaskAsync(this._getTaskShape({ favorite: !favorite }));
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _setTaskEditingState = (editState) => {
        if (editState) {
            this.setState({
                isTaskEditing: true,
            }, this._setTaskInputFocus);
        } else {
            this.setState({
                isTaskEditing: false,
            });
        }
    };

    _handleInputDoubleClick = () => {
        if (!this.state.isTaskEditing) {
            this._setTaskEditingState(true);
        }
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const enterKeyPressed = event.key === 'Enter' || event.keyCode === 13;
        const escapeKeyPressed = event.key === 'Escape' || event.keyCode === 27;

        if (enterKeyPressed) {
            if (this.state.newMessage) {
                this._updateTask();
            } else {
                return null;
            }
        }

        if (escapeKeyPressed) {
            this._cancelUpdatingTaskMessage();
        }
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage:    this.props.message,
            isTaskEditing: false,
        });
    };

    _setTaskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _updateTask = () => {
        const { message, _updateTaskAsync } = this.props;

        if (this.state.newMessage !== message) {
            _updateTaskAsync(
                this._getTaskShape({ message: this.state.newMessage })
            );
            this._setTaskEditingState(false);
        } else {
            this._setTaskEditingState(false);

            return null;
        }
    };

    _removeTask = () => {
        const { id, _removeTaskAsync } = this.props;

        _removeTaskAsync(id);
    };

    render () {
        const { completed, favorite } = this.props;
        const { isTaskEditing, newMessage } = this.state;

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
                            ref = { this.taskInput }
                            type = 'text'
                            value = { newMessage }
                            onChange = { this._updateNewTaskMessage }
                            onKeyDown = { this._updateTaskMessageOnKeyDown }
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
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
