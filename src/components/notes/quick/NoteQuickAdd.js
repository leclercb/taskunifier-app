import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { FolderTitle } from 'components/folders/FolderTitle';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { applyNoteTemplateFromNoteFilter } from 'utils/TemplateUtils';

function NoteQuickAdd({ apis }) {
    const { appApi, folderApi, noteApi, noteFieldApi } = apis;

    const [values, setValues] = useState([]);
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

    const onChange = values => {
        if (values.includes('__ADD__')) {
            onAdd(values.filter(v => v !== '__ADD__'));
        } else {
            setValues(values);
        }
    };

    const onKeyInputDown = () => {
        setOpen(true);
    };

    const onFocus = () => {
        if (values.length > 0) {
            setOpen(true);
        }
    };

    const onBlur = () => {
        setOpen(false);
    };

    const onAdd = async values => {
        const newNote = {
            title: values[0]
        };

        applyNoteTemplateFromNoteFilter(noteApi.selectedNoteFilter, newNote, noteFieldApi.noteFields);

        values.forEach((value, index) => {
            if (index === 0) {
                return;
            }

            const object = JSON.parse(value.substr(value.lastIndexOf('__') + 2));
            newNote[object.field] = object.value;
        });

        const note = await noteApi.addNote(newNote);

        noteApi.setSelectedNoteIds(note.id);
        appApi.setEditingCell(note.id, 'title');

        setValues([]);
        setTimeout(() => setOpen(false));
    };

    return (
        <Select
            ref={selectRef}
            mode={values.length > 0 ? 'multiple' : 'tags'}
            value={values}
            placeholder="Quick add note..."
            onChange={onChange}
            onInputKeyDown={onKeyInputDown}
            onFocus={onFocus}
            onBlur={onBlur}
            open={open}
            className="joyride-note-quick-add"
            style={{ width: '100%', padding: 3 }}>
            {values.length > 0 ? [
                <Select.Option key='add' value="__ADD__">
                    <Icon icon="plus" text="Create note" />
                </Select.Option>,
                <Select.OptGroup key='folders' label="Folders">
                    {folderApi.nonArchivedFolders.map(folder => (
                        <Select.Option key={folder.id} value={folder.title + '__' + JSON.stringify({ field: 'folder', value: folder.id })}>
                            <FolderTitle folderId={folder.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            ] : null}
        </Select>
    );
}

NoteQuickAdd.propTypes = {
    apis: PropTypes.object.isRequired
};

export default withBusyCheck(NoteQuickAdd, () => ({
    appApi: useAppApi(),
    folderApi: useFolderApi(),
    noteApi: useNoteApi(),
    noteFieldApi: useNoteFieldApi()
}));