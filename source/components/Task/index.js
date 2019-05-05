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
        const taskProps = this._getTaskShape(props);

        this.state = {
            ...taskProps,
            inputIsDisabled: true,
        };
        console.log(this.state);
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

    _handleTaskCompletedStateChange = () => {
        this.setState(({ completed }) => ({
            completed: !completed,
        }), this._saveTask);
    }

    _handleTaskFavoriteStateChange = () => {
        this.setState(({ favorite }) => ({
            favorite: !favorite,
        }), this._saveTask);
    }

    _handleTaskMessageChange = (event) => {
        this.setState({
            message: event.target.value,
        });
    }

    _handleTaskMessageUpdate = () => {
        // A fallback option in case of esc press
        this.savedMessage = this.state.message;

        this.setState(({ inputIsDisabled }) => ({
            inputIsDisabled: !inputIsDisabled,
        }), this._setTaskInputFocus);
    };

    _handleInputDoubleClick = () => {
        if (this.state.inputIsDisabled) {
            this._handleTaskMessageUpdate();
        }
    }

    _handleInputKeyDown = (event) => {
        const enterKeyPressed = event.key === 'Enter' || event.keyCode === 13;
        const escapeKeyPressed = event.key === 'Escape' || event.keyCode === 27;

        if (enterKeyPressed) {
            this.setState(({ inputIsDisabled }) => ({
                inputIsDisabled: !inputIsDisabled,
            }));
            this._saveTask();
        }

        if (escapeKeyPressed) {
            this.setState(({ inputIsDisabled }) => ({
                message:         this.savedMessage,
                inputIsDisabled: !inputIsDisabled,
            }));
        }
    }

    _setTaskInputFocus = () => {
        this.taskInput.focus();
    }

    _saveTask = () => {
        const taskState = this._getTaskShape(this.state);

        console.log('task to save', taskState);
        // TODO: make API call to save task
    }

    _removeTask = () => {
        const { id, _removeTask } = this.props;

        _removeTask(id);
    }

    render () {
        const { completed, favorite, message, inputIsDisabled } = this.state;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#fff'
                        onClick = { this._handleTaskCompletedStateChange }
                    />
                    {/* Обертка вокруг дизебленого инпута, для активации по дабл клику */}
                    <div
                        onDoubleClick = { this._handleInputDoubleClick }>
                        <input
                            disabled = { inputIsDisabled }
                            maxLength = '50'
                            ref = { (input) => { this.taskInput = input; } }
                            type = 'text'
                            value = { message }
                            onChange = { this._handleTaskMessageChange }
                            onKeyDown = { this._handleInputKeyDown }
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
                        onClick = { this._handleTaskFavoriteStateChange }
                    />
                    <Edit
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._handleTaskMessageUpdate }
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
