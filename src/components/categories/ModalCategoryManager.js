import React from 'react';
import { Button, Modal } from 'antd';
import HelpButton from 'components/common/HelpButton';
import Icon from 'components/common/Icon';
import Spacer from 'components/common/Spacer';
import CategoryManager from 'components/categories/CategoryManager';
import { useAppApi } from 'hooks/UseAppApi';

function ModalCategoryManager() {
    const appApi = useAppApi();

    const onCloseCategoryManager = () => {
        appApi.setCategoryManagerOptions({ visible: false });
    };

    const onObjectSelection = objectId => {
        appApi.setCategoryManagerOptions({ objectId });
    };

    return (
        <Modal
            title={<Icon icon="cubes" text="Category Manager" />}
            visible={appApi.categoryManager.visible}
            width="80%"
            closable={false}
            onOk={onCloseCategoryManager}
            onCancel={onCloseCategoryManager}
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
                category={appApi.categoryManager.category}
                objectId={appApi.categoryManager.objectId}
                onCategorySelection={category => appApi.setCategoryManagerOptions({ category })}
                onObjectSelection={onObjectSelection} />
        </Modal>
    );
}

export default ModalCategoryManager;