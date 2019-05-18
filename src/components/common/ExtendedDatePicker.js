import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { InputNumber, Switch } from 'antd';
import DatePicker from 'components/common/DatePicker';
import Spacer from 'components/common/Spacer';

class ExtendedDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(checked) {
        if (this.props.onChange) {
            this.props.onChange(checked ? 0 : moment().toJSON());
        }
    }

    render() {
        return (
            <React.Fragment>
                <Switch
                    checked={Number.isInteger(this.props.value)}
                    onChange={this.onChange}
                    checkedChildren="Use number of days from now"
                    unCheckedChildren="Use fixed date"
                    style={{ marginRight: 10 }} />
                {Number.isInteger(this.props.value) ?
                    (
                        <React.Fragment>
                            <InputNumber {...this.props} />
                            <Spacer />
                            <span>({moment().add(this.props.value, 'days').format(this.props.format)})</span>
                        </React.Fragment>
                    ) : (
                        <DatePicker {...this.props} />
                    )}
            </React.Fragment>
        );
    }
}

ExtendedDatePicker.propTypes = {
    format: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    onChange: PropTypes.func
};

export default ExtendedDatePicker;