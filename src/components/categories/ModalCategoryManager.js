import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import CategoryManager from 'components/categories/CategoryManager';
import withApp from 'containers/WithApp';

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
            footer={(
                <Button onClick={onCloseCategoryManager}>
                    Close
                </Button>
            )}>
            <CategoryManager
                category={props.categoryManager.category}
                objectId={props.categoryManager.objectId}
                onCategorySelection={category => props.setCategoryManagerOptions({ category })}
                onObjectSelection={onObjectSelection} />
        </Modal>
    );
}

ModalCategoryManager.propTypes = {
    categoryManager: PropTypes.object.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired
};

export default withApp(ModalCategoryManager);