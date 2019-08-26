import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import NoteFilterManager from 'components/notefilters/NoteFilterManager';

function ModalNoteFilterManager(props) {
    const onCloseNoteFilterManager = () => {
        props.setNoteFilterManagerOptions({ visible: false });
    };

    const onNoteFilterSelection = noteFilterId => {
        props.setNoteFilterManagerOptions({ noteFilterId });
    };

    return (
        <Modal
            title={<Icon icon="filter" text="Note Filter Manager" />}
            visible={props.noteFilterManager.visible}
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
                noteFilterId={props.noteFilterManager.noteFilterId}
                onNoteFilterSelection={onNoteFilterSelection} />
        </Modal>
    );
}

ModalNoteFilterManager.propTypes = {
    noteFilterManager: PropTypes.object.isRequired,
    setNoteFilterManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalNoteFilterManager);