import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import Constants from '../../constants/Constants';

class StarCheckbox extends React.Component {
    onChange = () => {
        this.props.onChange(!this.props.checked);
    }

    render() {
        return (
            <Icon
                icon="star"
                color={this.props.checked ? Constants.starredColor : 'grey'}
                style={{ cursor: 'pointer' }}
                onClick={this.onChange} />
        );
    }
}

StarCheckbox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func
}

export default StarCheckbox;