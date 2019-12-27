import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import { createValueFromString } from 'utils/RichTextUtils';

function RichTextField(props) {
    const [value, setValue] = React.useState(createValueFromString(props.value));

    const editorRef = React.createRef();

    useEffect(() => {
        setValue(createValueFromString(props.value));
    }, [props.value]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSave = () => {
        const element = editorRef.current;

        setTimeout(() => {
            if (!element || !element.contains(document.activeElement)) {
                if (props.onChange) {
                    props.onChange(value.toString('html'));
                }

                if (props.onBlur) {
                    props.onBlur(value.toString('html'));
                }
            }
        });
    };

    return (
        <div ref={editorRef} style={{ height: '100%' }}>
            <RichTextEditor
                {...props}
                value={value}
                onChange={setValue}
                onBlur={onSave}
                rootStyle={{ height: '100%' }}
                editorClassName="rte-editor" />
        </div>
    );
}

RichTextField.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool
};

export default RichTextField;