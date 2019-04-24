import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from '../../containers/WithApp';
import Icon from '../common/Icon';
import NoteFilterManager from './NoteFilterManager';

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
            footer={
                <Button onClick={onCloseNoteFilterManager}>
                    Close
                </Button>
            }>
            <NoteFilterManager
                noteFilterId={props.noteFilterManager.noteFilterId}
                onNoteFilterSelection={onNoteFilterSelection} />
        </Modal>
    );
}

ModalNoteFilterManager.propTypes = {
    setNoteFilterManagerOptions: PropTypes.func.isRequired,
    noteFilterManager: PropTypes.object.isRequired
};

export default withApp(ModalNoteFilterManager);