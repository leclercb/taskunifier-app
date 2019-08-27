import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withThread from 'containers/WithThread';
import ProcessList from 'components/thread/ProcessList';
import Icon from 'components/common/Icon';
import { ProcessPropType } from 'proptypes/ProcessPropTypes';

function ModalThreadManager(props) {
    const onClose = () => {
        props.setThreadManagerVisible(false);
    };

    return (
        <Modal
            title={<Icon icon="cogs" text="Progress" />}
            visible={props.threadManagerVisible}
            closable={false}
            onOk={onClose}
            onCancel={onClose}
            footer={(
                <Button onClick={onClose}>
                    Close
                </Button>
            )}>
            <ProcessList processes={props.processes} />
        </Modal>
    );
}

ModalThreadManager.propTypes = {
    processes: PropTypes.arrayOf(ProcessPropType.isRequired).isRequired,
    threadManagerVisible: PropTypes.bool.isRequired,
    setThreadManagerVisible: PropTypes.func.isRequired
};

export default withThread(ModalThreadManager);