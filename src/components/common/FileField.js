import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { openPath, showOpenDialog, showSaveDialog } from 'utils/ElectronIpc';

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
        openPath(this.state.value);
    }

    async onSelectFile() {
        this.selectingFile = true;

        let result;

        if (this.props.type === 'save') {
            result = await showSaveDialog(this.props.options);
        } else {
            result = await showOpenDialog(this.props.options);
        }

        let filePath;

        if (this.props.type === 'save') {
            filePath = result.filePath;
        } else {
            filePath = result.filePaths && result.filePaths.length === 1 ? result.filePaths[0] : null;
        }

        if (!result.canceled && filePath) {
            this.onChange(filePath);

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