import React from 'react';
import { Button, Modal } from 'antd';
import withApp from '../../containers/WithApp';
import Icon from '../common/Icon';
import CategoryManager from './CategoryManager';

function ModalCategoryManager(props) {
    const onSetCategoryManagerVisible = () => {
        props.setCategoryManagerVisible(false);
    }

    return (
        <Modal
            title={<Icon icon="cubes" text="Category Manager" />}
            visible={props.categoryManagerVisible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onSetCategoryManagerVisible}>
                    Close
                </Button>
            }>
            <CategoryManager />
        </Modal>
    );
}

export default withApp(ModalCategoryManager);