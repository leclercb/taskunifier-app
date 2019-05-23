import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import HelpButton from 'components/common/HelpButton';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
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
                <React.Fragment>
                    <HelpButton id="categoryManager" />
                    <Spacer />
                    <Button onClick={onCloseCategoryManager}>
                        Close
                    </Button>
                </React.Fragment>
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