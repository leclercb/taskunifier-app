import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Icon from '../common/Icon';
import withApp from '../../containers/WithApp';
import Spacer from '../common/Spacer';

function HeaderMenu(props) {
    const onLoad = () => {
        props.loadData();
    };

    const onSave = () => {
        props.saveData();
    };

    const onSynchronize = () => {
        props.synchronize();
    };

    return (
        <React.Fragment>
            <Button onClick={onLoad}>{<Icon icon="folder-open" text="Load" />}</Button>
            <Spacer />
            <Button onClick={onSave}>{<Icon icon="save" text="Save" />}</Button>
            <Spacer />
            <Button onClick={onSynchronize}>{<Icon icon="cogs" text="Synchronize" />}</Button>
        </React.Fragment>
    );
}

HeaderMenu.propTypes = {
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired
}

export default withApp(HeaderMenu);