import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { toStringRepeatFrom } from 'utils/StringUtils';

class RepeatFromField extends React.Component {
    render() {
        return (
            <Select {...this.props}>
                <Select.Option key={'dueDate'} value={'dueDate'}>
                    {toStringRepeatFrom('dueDate')}
                </Select.Option>
                <Select.Option key={'completionDate'} value={'completionDate'}>
                    {toStringRepeatFrom('completionDate')}
                </Select.Option>
            </Select>
        );
    }
}

RepeatFromField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default RepeatFromField;