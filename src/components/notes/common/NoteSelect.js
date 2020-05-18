import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import withBusyCheck from 'containers/WithBusyCheck';
import Icon from 'components/common/Icon';
import { useNoteApi } from 'hooks/UseNoteApi';

const NoteSelect = forwardRef(function NoteSelect({ apis, value, ...props }, ref) {
    const { noteApi } = apis;
    const v = noteApi.notes.find(note => note.id === value) ? value : undefined;

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}
            value={v}>
            {noteApi.notes.map(note => (
                <Select.Option key={note.id} value={note.id} title={note.title}>
                    <Icon icon="circle" color={note.color} text={note.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

NoteSelect.displayName = 'ForwardRefNoteSelect';

NoteSelect.propTypes = {
    apis: PropTypes.object.isRequired,
    value: PropTypes.string
};

export default withBusyCheck(NoteSelect, () => ({
    noteApi: useNoteApi()
}));