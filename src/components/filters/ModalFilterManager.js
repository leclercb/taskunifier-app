import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import withApp from '../../containers/WithApp';
import Icon from '../common/Icon';
import FilterManager from './FilterManager';

function ModalFilterManager(props) {
    const onCloseFilterManager = () => {
        props.setFilterManagerOptions({ visible: false });
    };

    const onFilterSelection = filterId => {
        props.setFilterManagerOptions({ filterId })
    };

    return (
        <Modal
            title={<Icon icon="filter" text="Filter Manager" />}
            visible={props.filterManager.visible}
            width="80%"
            closable={false}
            footer={
                <Button onClick={onCloseFilterManager}>
                    Close
                </Button>
            }>
            <FilterManager
                filterId={props.filterManager.filterId}
                onFilterSelection={onFilterSelection} />
        </Modal>
    );
}

ModalFilterManager.propTypes = {
    setFilterManagerOptions: PropTypes.func.isRequired,
    filterManager: PropTypes.object.isRequired
};

export default withApp(ModalFilterManager);