import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

const { ipcRenderer } = window.require('electron');

class FileField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.selectingFile = false;

        this.onChange = this.onChange.bind(this);
        this.onOpenFile = this.onOpenFile.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                value: this.props.value
            });
        }
    }

    onChange(value) {
        this.setState({ value });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    onOpenFile() {
        return ipcRenderer.send('open-file', this.state.value);
    }

    onSelectFile() {
        this.selectingFile = true;

        const files = ipcRenderer.sendSync('show-open-dialog', {
            properties: [
                'openFile'
            ]
        });

        if (files && files.length === 1) {
            this.onChange(files[0]);

            if (this.props.onPressEnter) {
                this.props.onPressEnter();
            }
        }

        setTimeout(() => {
            this.selectingFile = false;
        }, 200);
    }

    render() {
        const { readOnly } = this.props;

        if (readOnly) {
            return (
                <Icon
                    icon={'folder-open'}
                    style={{ cursor: 'pointer' }}
                    onIconClick={this.onOpenFile}
                    text={this.state.value} />
            );
        }

        return (
            <Input
                {...this.props}
                value={this.state.value}
                onChange={event => this.onChange(event.target.value)}
                onBlur={() => {
                    if (this.props.onBlur) {
                        setTimeout(() => {
                            if (!this.selectingFile) {
                                this.props.onBlur();
                            }
                        }, 100);
                    }
                }}
                suffix={(
                    <Icon
                        icon={'folder-open'}
                        style={{ cursor: 'pointer' }}
                        onIconClick={this.onSelectFile} />
                )} />
        );
    }
}

FileField.propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onPressEnter: PropTypes.func
};

export default FileField;