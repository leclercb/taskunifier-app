import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from 'containers/WithApp';
import Icon from 'components/common/Icon';
import CategoryManager from 'components/categories/CategoryManager';

function ModalCategoryManager(props) {
    const onCloseCategoryManager = () => {
        props.setCategoryManagerOptions({ visible: false });
    };

    const onObjectSelection = objectId => {
        props.setCategoryManagerOptions({ objectId });
    };

    return (
        <Modal
            title={<Icon icon="cubes" text="Category Manager" />}
            visible={props.categoryManager.visible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onCloseCategoryManager}>
                    Close
                </Button>
            }>
            <CategoryManager
                category={props.categoryManager.category}
                objectId={props.categoryManager.objectId}
                onCategorySelection={category => props.setCategoryManagerOptions({ category })}
                onObjectSelection={onObjectSelection} />
        </Modal>
    );
}

ModalCategoryManager.propTypes = {
    setCategoryManagerOptions: PropTypes.func.isRequired,
    categoryManager: PropTypes.object.isRequired
};

export default withApp(ModalCategoryManager);