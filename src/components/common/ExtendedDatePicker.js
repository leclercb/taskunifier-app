import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker, InputNumber, Switch } from 'antd';

class ExtendedDatePicker extends React.Component {
    onChange = checked => {
        this.props.onChange(checked ? 0 : moment());
    }

    render() {
        console.log(this.props, Number.isInteger(this.props.value))
        return (
            <React.Fragment>
                <Switch
                    checked={Number.isInteger(this.props.value)} onChange={this.onChange}
                    checkedChildren="Use number of days from now"
                    unCheckedChildren="Use fixed date"
                    style={{ marginRight: 10 }} />
                {Number.isInteger(this.props.value) ?
                    (<InputNumber {...this.props} />) :
                    (<DatePicker {...this.props} />)}
            </React.Fragment>
        );
    }
}

ExtendedDatePicker.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object
    ]),
    onChange: PropTypes.func
}

export default ExtendedDatePicker;