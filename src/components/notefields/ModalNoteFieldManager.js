import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import NoteFieldManager from 'components/notefields/NoteFieldManager';

function ModalNoteFieldManager(props) {
    const onCloseNoteFieldManager = () => {
        props.setNoteFieldManagerOptions({ visible: false });
    };

    const onNoteFieldSelection = noteFieldId => {
        props.setNoteFieldManagerOptions({ noteFieldId });
    };

    return (
        <Modal
            title={<Icon icon="columns" text="Note Field Manager" />}
            visible={props.noteFieldManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseNoteFieldManager}
            onCancel={onCloseNoteFieldManager}
            footer={(
                <Button onClick={onCloseNoteFieldManager}>
                    Close
                </Button>
            )}>
            <NoteFieldManager
                noteFieldId={props.noteFieldManager.noteFieldId}
                onNoteFieldSelection={onNoteFieldSelection} />
        </Modal>
    );
}

ModalNoteFieldManager.propTypes = {
    noteFieldManager: PropTypes.object.isRequired,
    setNoteFieldManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalNoteFieldManager);