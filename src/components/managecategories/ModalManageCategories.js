import React from 'react';
import { Button, Modal } from 'antd';
import withApp from '../../containers/WithApp';
import withContexts from '../../containers/WithContexts';
import Icon from '../common/Icon';
import ContextForm from '../contexts/ContextForm';

function ModalManageCategories(props) {
    const onSetManageCategoriesVisible = () => {
        props.setManageCategoriesVisible(false);
    }

    return (
        <Modal
            title={<Icon icon="cubes" text="Manage Categories" />}
            visible={props.manageCategoriesVisible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onSetManageCategoriesVisible}>
                    Close
                </Button>
            }>
            <ContextForm context={props.contexts[0]} />
        </Modal>
    );
}

export default withContexts(withApp(ModalManageCategories));