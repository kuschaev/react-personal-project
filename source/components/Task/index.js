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
        // ...this._getTaskShape(),
        // ...this.props,
        inputIsDisabled: true,
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
        }));
        this._saveTask();
    }

    _handleTaskFavoriteStateChange = () => {
        this.setState(({ favorite }) => ({
            favorite: !favorite,
        }));
        this._saveTask();
    }

    _handleTaskMessageChange = (event) => {
        this.setState({
            message: event.target.value,
        });
    }

    // TODO: handle clicks w/o message change
    _handleTaskMessageUpdate = () => {
        // Saving task if user pressed edit again
        if (!this.state.inputIsDisabled) {
            this._saveTask();
        }

        this.setState(({ inputIsDisabled }) => ({
            inputIsDisabled: !inputIsDisabled,
        }));
    };

    _handleInputDoubleClick = () => {
        console.log('_handleInputDoubleClick triggered');
        if (this.state.inputIsDisabled) {
            this.setState(({ inputIsDisabled }) => ({
                inputIsDisabled: !inputIsDisabled,
            }));
        }
    }

    _handleInputKeyPress = (event) => {
        const enterKeyPressed = event.key === 'Enter' || event.keyCode === 13;

        if (enterKeyPressed) {
            this._handleTaskMessageUpdate();
        }
    }

    _saveTask = () => {
        console.log('task to save', this.state);
        // TODO: make API call to save task
    }

    _removeTask = () => {
        const { id, _removeTask } = this.props;

        _removeTask(id);
    }

    render () {
        const { inputIsDisabled } = this.state;
        const { completed, favorite, message } = this.props;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#fff'
                        // onClick = { this._handleTaskCompletedStateChange }
                    />
                    <input
                        defaultValue = { message }
                        disabled = { inputIsDisabled }
                        maxLength = '50'
                        type = 'text'
                        onChange = { this._handleTaskMessageChange }
                        onDoubleClick = { this._handleInputDoubleClick }
                        onKeyPress = { this._handleInputKeyPress }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        // onClick = { this._handleTaskFavoriteStateChange }
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
