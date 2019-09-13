import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { FolderTitle } from 'components/folders/FolderTitle';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useNoteApi } from 'hooks/UseNoteApi';

function NoteQuickAdd() {
    const folderApi = useFolderApi();
    const noteApi = useNoteApi();

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

    const onBlur = () => {
        setOpen(false);
    };

    const onAdd = values => {
        const newNote = {
            title: values[0]
        };

        values.forEach((value, index) => {
            if (index === 0) {
                return;
            }

            const object = JSON.parse(value.substr(value.lastIndexOf('__') + 2));
            newNote[object.field] = object.value;
        });

        noteApi.addNote(newNote);

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
            onBlur={onBlur}
            open={open}
            style={{ width: '100%', padding: 3 }}>
            {values.length > 0 ? [
                <Select.Option key='add' value="__ADD__">
                    <Icon icon="plus" text="Create note" />
                </Select.Option>,
                <Select.OptGroup key='folders' label="Folders">
                    {folderApi.folders.map(folder => (
                        <Select.Option key={folder.id} value={folder.title + '__' + JSON.stringify({ field: 'folder', value: folder.id })}>
                            <FolderTitle folder={folder} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            ] : null}
        </Select>
    );
}

export default NoteQuickAdd;