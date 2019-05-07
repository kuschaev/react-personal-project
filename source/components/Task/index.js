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
    }

    // A known anti-pattern
    // componentDidUpdate (props) {
    //     console.log('cdu with', props);
    //     this.setState({ ...props });
    // }

    // static getDerivedStateFromProps (newProps, oldState) {
    //     console.log('newProps', newProps);
    //     console.log('oldState', oldState);

    //     if (newProps.completed !== oldState.completed) {
    //         return {
    //             completed: newProps.completed,
    //         };
    //     }

    //     return null;
    // }

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
            ({ completed }) => ({
                completed: !completed,
            }),
            this._updateTask
        );
    };

    _toggleTaskFavoriteState = () => {
        this.setState(
            ({ favorite }) => ({
                favorite: !favorite,
            }),
            this._updateTask
        );
    };

    _handleTaskMessageChange = (event) => {
        this.setState({
            message: event.target.value,
        });
    };

    _setTaskEditingState = () => {
        // A fallback option in case of esc press
        // or second task edit toggle
        if (this.state.inputIsDisabled) {
            this.savedMessage = this.state.message;
        }
        this.setState(({ inputIsDisabled }) => {
            if (!inputIsDisabled) {
                return {
                    inputIsDisabled: !inputIsDisabled,
                    message:         this.savedMessage,
                };
            }

            return {
                inputIsDisabled: !inputIsDisabled,
            };
        }, this._setTaskInputFocus);
    };

    _handleInputDoubleClick = () => {
        if (this.state.inputIsDisabled) {
            this._setTaskEditingState();
        }
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const enterKeyPressed = event.key === 'Enter' || event.keyCode === 13;
        const escapeKeyPressed = event.key === 'Escape' || event.keyCode === 27;

        if (enterKeyPressed) {
            this.setState(
                ({ inputIsDisabled }) => ({
                    inputIsDisabled: !inputIsDisabled,
                }),
                this._updateTask
            );
        }

        if (escapeKeyPressed) {
            this.setState(({ inputIsDisabled }) => ({
                message:         this.savedMessage,
                inputIsDisabled: !inputIsDisabled,
            }));
        }
    };

    _setTaskInputFocus = () => {
        this.taskInput.focus();
    };

    _updateTask = () => {
        const taskState = this._getTaskShape(this.state);
        const { _updateTask } = this.props;

        _updateTask([taskState]);
    };

    _removeTask = () => {
        const { id, _removeTask } = this.props;

        _removeTask(id);
    };

    // WTF block
    _updateNewTaskMessage = () => {};
    _updateTaskMessageOnClick = () => {};
    _cancelUpdatingTaskMessage = () => {};

    render () {
        const { completed, favorite, message, inputIsDisabled } = this.state;

        // console.log('task state from render', this.state);

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
                            disabled = { inputIsDisabled }
                            maxLength = '50'
                            ref = { (input) => {
                                this.taskInput = input;
                            } }
                            type = 'text'
                            value = { message }
                            onChange = { this._handleTaskMessageChange }
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
                        onClick = { this._setTaskEditingState }
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
