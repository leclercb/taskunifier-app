import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import NoteFilterInfo from 'components/notefilters/NoteFilterInfo';
import { NoteFilterPropType } from 'proptypes/NoteFilterPropTypes';

function ModalNoteFilterInfo({ noteFilter, visible, onClose }) {
    return (
        <Modal
            title={<Icon icon="filter" text="Note Filter Info" />}
            visible={visible}
            width="80%"
            closable={false}
            onOk={() => onClose()}
            onCancel={() => onClose()}
            footer={(
                <Button onClick={() => onClose()}>
                    Close
                </Button>
            )}>
            <NoteFilterInfo noteFilter={noteFilter} />
        </Modal>
    );
}

ModalNoteFilterInfo.propTypes = {
    noteFilter: NoteFilterPropType,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModalNoteFilterInfo;