import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import InputMask from 'inputmask-core';

const KEYCODE_Z = 90;
const KEYCODE_Y = 89;

InputMask.Pattern.prototype.transform = function transform(char, index) {
    const format = this.formatCharacters[this.pattern[index]];
    return typeof format.transform === 'function' ? format.transform(char, index) : char;
};

function isUndo(e) {
    return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z);
}

function isRedo(e) {
    return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y);
}

function getSelection(el) {
    let start, end;
    if (el.selectionStart !== undefined) {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        try {
            el.focus();
            const rangeEl = el.createTextRange();
            const clone = rangeEl.duplicate();

            rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
            clone.setEndPoint('EndToStart', rangeEl);

            start = clone.text.length;
            end = start + rangeEl.text.length;
        } catch (e) {
            /* not focused or not visible */
        }
    }

    return { start, end };
}

function setSelection(el, selection) {
    try {
        if (el.selectionStart !== undefined) {
            el.focus();
            el.setSelectionRange(selection.start, selection.end);
        } else {
            el.focus();
            const rangeEl = el.createTextRange();
            rangeEl.collapse(true);
            rangeEl.moveStart('character', selection.start);
            rangeEl.moveEnd('character', selection.end - selection.start);
            rangeEl.select();
        }
    } catch (e) {
        /* not focused or not visible */
    }
}

export class MaskTextField extends Component {
    constructor(props) {
        super(props);

        const options = {
            pattern: props.mask,
            value: props.value,
            formatCharacters: props.formatCharacters
        };

        if (props.placeholderChar) {
            options.placeholderChar = props.placeholderChar;
        }

        this.mask = new InputMask(options);

        this._updatePattern = this._updatePattern.bind(this);
        this._updateMaskSelection = this._updateMaskSelection.bind(this);
        this._updateInputSelection = this._updateInputSelection.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this._onPaste = this._onPaste.bind(this);
        this._getDisplayValue = this._getDisplayValue.bind(this);
        this._keyPressPropName = this._keyPressPropName.bind(this);
        this._getEventHandlers = this._getEventHandlers.bind(this);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
        this.getInputProps = this.getInputProps.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!this.props.mask) {
            return null;
        }

        if (this.props.mask !== prevProps.mask) {
            this._updatePattern(this.props);
        }

        if (this.props.mask !== prevProps.mask && this.props.value !== prevProps.mask) {
            if (this.mask.getValue() === this.mask.emptyValue) {
                this.mask.setPattern(this.props.mask, { value: this.props.value });
            } else {
                this.mask.setPattern(this.props.mask, { value: this.mask.getRawValue() });
            }
        } else if (this.props.mask !== prevProps.mask) {
            this.mask.setPattern(this.props.mask, { value: this.mask.getRawValue() });
        } else if (this.props.value !== prevProps.value) {
            this.mask.setValue(this.props.value);
        }

        if (this.props.mask !== prevProps.mask && this.mask.selection.start) {
            this._updateInputSelection();
        }
    }

    _updatePattern(props) {
        this.mask.setPattern(props.mask, {
            value: this.mask.getRawValue(),
            selection: getSelection(this.input)
        });
    }

    _updateMaskSelection() {
        this.mask.selection = getSelection(this.input);
    }

    _updateInputSelection() {
        setSelection(this.input, this.mask.selection);
    }

    _onChange(e) {
        let maskValue = this.mask.getValue();
        let incomingValue = e.target.value;

        if (incomingValue !== maskValue) {
            this._updateMaskSelection();
            this.mask.setValue(incomingValue);
            e.target.value = this._getDisplayValue();
            this._updateInputSelection();
        }

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    _onKeyDown(e) {
        if (isUndo(e)) {
            e.preventDefault();
            if (this.mask.undo()) {
                e.target.value = this._getDisplayValue();
                this._updateInputSelection();
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
            return;
        } else if (isRedo(e)) {
            e.preventDefault();
            if (this.mask.redo()) {
                e.target.value = this._getDisplayValue();
                this._updateInputSelection();
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
            return;
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            this._updateMaskSelection();
            if (this.mask.backspace()) {
                let value = this._getDisplayValue();
                e.target.value = value;
                if (value) {
                    this._updateInputSelection();
                }
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
        }
    }

    _onKeyPress(e) {
        if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
            return;
        }

        e.preventDefault();
        this._updateMaskSelection();

        if (this.mask.input(e.key || e.data)) {
            e.target.value = this.mask.getValue();
            this._updateInputSelection();
            if (this.props.onChange) {
                this.props.onChange(e);
            }
        }
    }

    _onPaste(e) {
        e.preventDefault();
        this._updateMaskSelection();

        if (this.mask.paste(e.clipboardData.getData('Text'))) {
            e.target.value = this.mask.getValue();

            // Timeout needed for IE
            setTimeout(() => this._updateInputSelection(), 0);
            if (this.props.onChange) {
                this.props.onChange(e);
            }
        }
    }

    _getDisplayValue() {
        const value = this.mask.getValue();
        return value === this.mask.emptyValue ? '' : value;
    }

    _keyPressPropName() {
        if (typeof navigator !== 'undefined') {
            return navigator.userAgent.match(/Android/i) ? 'onBeforeInput' : 'onKeyPress';
        }

        return 'onKeyPress';
    }

    _getEventHandlers() {
        return {
            onChange: this._onChange,
            onKeyDown: this._onKeyDown,
            onPaste: this._onPaste,
            [this._keyPressPropName()]: this._onKeyPress
        };
    }

    focus() {
        this.input.focus();
    }

    blur() {
        this.input.blur();
    }

    getInputProps() {
        const ref = r => {
            this.input = r ? r.input : null;
        };

        const defaultValue = this.mask.getValue();
        const maxLength = this.mask.pattern.length;
        const eventHandlers = this._getEventHandlers();
        const { placeholder = this.mask.emptyValue } = this.props;

        const { ...cleanedProps } = this.props;

        const props = { ...cleanedProps, ...eventHandlers, ref, maxLength, placeholder, defaultValue };
        delete props.placeholderChar;
        delete props.formatCharacters;

        return props;
    }

    render() {
        return (
            <Input {...(this.props.mask ? this.getInputProps() : {})} />
        );
    }
}

MaskTextField.propTypes = {
    value: PropTypes.string,
    mask: PropTypes.string.isRequired,
    formatCharacters: PropTypes.object,
    placeholderChar: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
};

export default MaskTextField;