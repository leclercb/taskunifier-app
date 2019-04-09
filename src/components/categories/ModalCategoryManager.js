import React from 'react';
import { Button, Modal } from 'antd';
import withApp from '../../containers/WithApp';
import Icon from '../common/Icon';
import CategoryManager from './CategoryManager';

function ModalCategoryManager(props) {
    const onSetCategoryManagerOptions = () => {
        props.setCategoryManagerOptions({visible: false});
    }

    return (
        <Modal
            title={<Icon icon="cubes" text="Category Manager" />}
            visible={props.categoryManager.visible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onSetCategoryManagerOptions}>
                    Close
                </Button>
            }>
            <CategoryManager
                category={props.categoryManager.category}
                objectId={props.categoryManager.objectId}
                onCategorySelection={category => props.setCategoryManagerOptions({category})}
                onObjectSelection={objectId => props.setCategoryManagerOptions({objectId})} />
        </Modal>
    );
}

export default withApp(ModalCategoryManager);