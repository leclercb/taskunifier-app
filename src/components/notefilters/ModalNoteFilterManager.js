import React from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import NoteFilterManager from 'components/notefilters/NoteFilterManager';
import { useAppApi } from 'hooks/UseAppApi';

function ModalNoteFilterManager() {
    const appApi = useAppApi();

    const onCloseNoteFilterManager = () => {
        appApi.setNoteFilterManagerOptions({ visible: false });
    };

    const onNoteFilterSelection = noteFilterId => {
        appApi.setNoteFilterManagerOptions({ noteFilterId });
    };

    return (
        <Modal
            title={<Icon icon="filter" text="Note Filter Manager" />}
            visible={appApi.noteFilterManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseNoteFilterManager}
            onCancel={onCloseNoteFilterManager}
            footer={(
                <Button onClick={onCloseNoteFilterManager}>
                    Close
                </Button>
            )}>
            <NoteFilterManager
                noteFilterId={appApi.noteFilterManager.noteFilterId}
                onNoteFilterSelection={onNoteFilterSelection} />
        </Modal>
    );
}

export default ModalNoteFilterManager;