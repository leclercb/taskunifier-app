import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import TaskFilterInfo from 'components/taskfilters/TaskFilterInfo';
import { TaskFilterPropType } from 'proptypes/TaskFilterPropTypes';

function ModalTaskFilterInfo({ taskFilter, visible, onClose }) {
    return (
        <Modal
            title={<Icon icon="filter" text="Task Filter Info" />}
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
            <TaskFilterInfo taskFilter={taskFilter} />
        </Modal>
    );
}

ModalTaskFilterInfo.propTypes = {
    taskFilter: TaskFilterPropType,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ModalTaskFilterInfo;