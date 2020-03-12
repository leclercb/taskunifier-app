import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Input, Tooltip } from 'antd';
import LeftRight from 'components/common/LeftRight';
import ModalRepeatManager from 'components/repeat/ModalRepeatManager';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';
import { toStringRepeat } from 'utils/StringUtils';

class RepeatField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: props.defaultOpened
        };

        this.setOpened = this.setOpened.bind(this);
    }

    setOpened(opened) {
        if (this.state.opened !== opened) {
            this.setState({
                opened
            });

            if (this.props.onOpenChange) {
                this.props.onOpenChange(opened);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.defaultOpened !== prevProps.defaultOpened) {
            this.setOpened(this.props.defaultOpened);
        }
    }

    render() {
        const { repeat, readOnly, onChange, ...wrappedProps } = this.props;
        delete wrappedProps.defaultOpened;
        delete wrappedProps.onOpenChange;

        if (readOnly) {
            const fromComp = (repeat || '').includes(';FROMCOMP');

            if (!repeat) {
                return <span>&nbsp;</span>;
            }

            return (
                <LeftRight right={(
                    <Tooltip title={fromComp ? 'From Completion Date' : 'From Due Date'}>
                        <Avatar size="small" style={{ backgroundColor: fromComp ? '#666666' : '#bbbbbb' }}>
                            {fromComp ? 'CD' : 'DD'}
                        </Avatar>
                    </Tooltip>
                )}>
                    {toStringRepeat(repeat, false)}
                </LeftRight>
            );
        }

        return (
            <React.Fragment>
                <ModalRepeatManager
                    visible={this.state.opened}
                    onClose={() => this.setOpened(false)}
                    repeat={repeat}
                    updateRepeat={repeat => onChange(repeat)} />
                <Input
                    {...wrappedProps}
                    readOnly={true}
                    value={toStringRepeat(repeat, true)}
                    onClick={() => this.setOpened(true)}
                    onPressEnter={() => this.setOpened(true)} />
            </React.Fragment>
        );
    }
}

RepeatField.propTypes = {
    repeat: RepeatPropType,
    readOnly: PropTypes.bool,
    defaultOpened: PropTypes.bool,
    onChange: PropTypes.func,
    onOpenChange: PropTypes.func,
    fieldMode: PropTypes.oneOf(['default', 'table'])
};

RepeatField.defaultProps = {
    defaultOpened: false
};

export default RepeatField;