import React from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import NoteFieldManager from 'components/notefields/NoteFieldManager';
import { useAppApi } from 'hooks/UseAppApi';

function ModalNoteFieldManager() {
    const appApi = useAppApi();

    const onCloseNoteFieldManager = () => {
        appApi.setNoteFieldManagerOptions({ visible: false });
    };

    const onNoteFieldSelection = noteFieldId => {
        appApi.setNoteFieldManagerOptions({ noteFieldId });
    };

    return (
        <Modal
            title={<Icon icon="columns" text="Note Field Manager" />}
            visible={appApi.noteFieldManager.visible}
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
                noteFieldId={appApi.noteFieldManager.noteFieldId}
                onNoteFieldSelection={onNoteFieldSelection} />
        </Modal>
    );
}

export default ModalNoteFieldManager;