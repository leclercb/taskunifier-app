import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

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
        const { ipcRenderer } = window.require('electron');
        return ipcRenderer.send('open-file', this.state.value);
    }

    onSelectFile() {
        this.selectingFile = true;

        const { ipcRenderer } = window.require('electron');

        ipcRenderer.once('file-paths-selected', (event, message) => {
            let filePath;

            if (this.props.type === 'save') {
                filePath = message.filePath;
            } else {
                filePath = message.filePaths && message.filePaths.length === 1 ? message.filePaths[0] : null;
            }

            if (!message.canceled && filePath) {
                this.onChange(filePath);

                if (this.props.onPressEnter) {
                    this.props.onPressEnter();
                }
            }

            setTimeout(() => {
                this.selectingFile = false;
            }, 200);
        });

        ipcRenderer.send(this.props.type === 'save' ? 'show-save-dialog' : 'show-open-dialog', this.props.options);
    }

    render() {
        const { readOnly } = this.props;

        if (readOnly) {
            if (process.env.REACT_APP_MODE === 'electron' && this.state.value) {
                return (
                    <Icon
                        icon={'folder-open'}
                        style={{ cursor: 'pointer' }}
                        onIconClick={this.onOpenFile}
                        text={this.state.value} />
                );
            } else {
                return <span>{this.state.value}</span>;
            }
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
                suffix={process.env.REACT_APP_MODE === 'electron' ? (
                    <Icon
                        icon={'folder-open'}
                        style={{ cursor: 'pointer' }}
                        onIconClick={this.onSelectFile} />
                ) : null} />
        );
    }
}

FileField.propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onPressEnter: PropTypes.func,
    type: PropTypes.oneOf(['open', 'save']).isRequired,
    options: PropTypes.object
};

FileField.defaultProps = {
    type: 'open',
    options: {
        properties: [
            'openFile'
        ]
    }
};

export default FileField;