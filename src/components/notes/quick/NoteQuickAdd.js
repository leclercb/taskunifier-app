import React, { useRef, useState } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import FolderTitle from 'components/folders/FolderTitle';
import TagsTitle from 'components/tags/TagsTitle';
import withBusyCheck from 'containers/WithBusyCheck';
import { useAppApi } from 'hooks/UseAppApi';
import { useFolderApi } from 'hooks/UseFolderApi';
import { useNoteApi } from 'hooks/UseNoteApi';
import { useNoteFieldApi } from 'hooks/UseNoteFieldApi';
import { useTagApi } from 'hooks/UseTagApi';
import { applyNoteTemplateFromNoteFilter } from 'utils/TemplateUtils';

function NoteQuickAdd({ apis }) {
    const { appApi, folderApi, noteApi, noteFieldApi, tagApi } = apis;

    const [values, setValues] = useState([]);
    const selectRef = useRef(null);

    const onChange = values => {
        if (values.includes('__ADD__')) {
            onAdd(values.filter(v => v !== '__ADD__'));
        } else {
            setValues(values);
        }
    };

    const onAdd = async values => {
        const newNote = {
            title: values[0]
        };

        applyNoteTemplateFromNoteFilter(noteApi.selectedNoteFilter, newNote, noteFieldApi.noteFields);

        values.forEach((value, index) => {
            value = value.trim();

            if (!value) {
                return;
            }

            if (index === 0) {
                return;
            }

            let object = null;

            try {
                if (value.includes('__')) {
                    const o = JSON.parse(value.substr(value.lastIndexOf('__') + 2));

                    if (typeof o === 'object' && o.field && Object.prototype.hasOwnProperty.call(o, 'value')) {
                        object = o;
                    }
                }
            } catch (e) {
                // Ignore
            }

            if (!object) {
                return;
            }

            switch (object.field) {
                case 'tags':
                    newNote.tags = [...(newNote.tags || []), object.value];
                    break;
                default:
                    newNote[object.field] = object.value;
                    break;
            }
        });

        const note = await noteApi.addNote(newNote);

        noteApi.setSelectedNoteIds(note.id);
        appApi.setEditingCell(note.id, 'title');

        setValues([]);
    };

    return (
        <Select
            ref={selectRef}
            mode={values.length > 0 ? 'multiple' : 'tags'}
            value={values}
            placeholder="Quick add note..."
            onChange={onChange}
            className="joyride-note-quick-add"
            style={{ width: '100%', padding: 3 }}>
            {values.length > 0 ? [
                <Select.Option key='add' value="__ADD__">
                    <Icon icon="plus" text="Create note" />
                </Select.Option>,
                <Select.Option key="star" value={'Star__' + JSON.stringify({ field: 'star', value: true })}>
                    <Icon icon="star" text="Star" color="#fcde35" />
                </Select.Option>,
                <Select.OptGroup key='folders' label="Folders">
                    {folderApi.nonArchivedFolders.map(folder => (
                        <Select.Option key={folder.id} value={folder.title + '__' + JSON.stringify({ field: 'folder', value: folder.id })}>
                            <FolderTitle folderId={folder.id} />
                        </Select.Option>
                    ))}
                </Select.OptGroup>,
                <Select.OptGroup key='tags' label="Tags">
                    {tagApi.tags.map(tag => (
                        <Select.Option key={tag.id} value={tag.title + '__' + JSON.stringify({ field: 'tags', value: tag.id })}>
                            <TagsTitle tagIds={[tag.id]} />
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
    noteFieldApi: useNoteFieldApi(),
    tagApi: useTagApi()
}));