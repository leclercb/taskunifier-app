import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useNoteApi } from 'hooks/UseNoteApi';
import { NotePropType } from 'proptypes/NotePropTypes';

function NoteMenu({ selectedNotes, children }) {
    const noteApi = useNoteApi();

    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            const action = item.props.action;

            switch (action.type) {
                case 'duplicate':
                    selectedNotes.forEach(note => onDuplicateNote(note));
                    break;
                case 'remove':
                    onRemoveNotes(selectedNotes.map(note => note.id));
                    break;
                default:
                    break;
            }
        }

        setVisible(false);
    };

    const onDuplicateNote = note => {
        noteApi.duplicateNote(note);
    };

    const onRemoveNotes = noteIds => {
        noteApi.deleteNote(noteIds);
    };

    const suffix = `${selectedNotes.length} note${selectedNotes.length > 1 ? 's' : ''}`;

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            <Menu.Item key="duplicate" action={{ type: 'duplicate' }}>
                <Icon icon="copy" text={`Duplicate ${suffix}`} />
            </Menu.Item>
            <Menu.Item key="remove" action={{ type: 'remove' }}>
                <Icon icon="trash-alt" text={`Remove ${suffix}`} />
            </Menu.Item>
        </Menu>

    );

    // Dropdown trigger is not working in React Virtualized Grid
    return (
        <div
            onClick={() => setVisible(false)}
            onContextMenu={() => setVisible(true)}
            style={{ flexGrow: 1 }}>
            <Dropdown
                overlay={menu}
                trigger={['contextMenu']}
                visible={visible}
                onVisibleChange={setVisible}>
                {children}
            </Dropdown>
        </div>
    );
}

NoteMenu.propTypes = {
    selectedNotes: PropTypes.arrayOf(NotePropType.isRequired).isRequired,
    children: PropTypes.node.isRequired
};

export default NoteMenu;