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

    render () {
        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = {Styles.toggleTaskCompletedState}>
                        <Checkbox />
                    </div>
                    <input disabled maxLength = '50' type = 'text'
                            value = 'Qwerty' />
                </div>
                <div className = { Styles.actions }>
                    <div className = { Styles.toggleTaskFavoriteState }>
                        <Star />
                    </div>
                    <div className = { Styles.updateTaskMessageOnClick }>
                        <Edit />
                    </div>
                    <div style = { { width: '17px', height: '17px'} }>
                        <Remove />
                    </div>
                </div>
            </li>
        );
    }
}
