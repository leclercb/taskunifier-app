import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Icon from '../common/Icon';
import withApp from '../../containers/WithApp';
import Spacer from '../common/Spacer';
import LeftRight from '../common/LeftRight';
import Logo from '../common/Logo';

function Header(props) {
    const onLoad = () => {
        props.loadData();
    };

    const onSave = () => {
        props.saveData();
    };

    const onBackup = () => {
        props.backupData();
    };

    const onCleanBackups = () => {
        props.cleanBackups();
    };

    const onSynchronize = () => {
        props.synchronize();
    };

    const onSetSettingsVisible = () => {
        props.setSettingsVisible(true);
    };

    const onSetCategoryManagerVisible = () => {
        props.setCategoryManagerOptions({ visible: true });
    };

    const onSetFilterManagerVisible = () => {
        props.setFilterManagerOptions({ visible: true });
    };

    return (
        <LeftRight right={(
            <React.Fragment>
                {props.pro ? (
                    <img src="/resources/images/pro_badge.png" height={32} alt="Pro" style={{ marginRight: 10 }} />
                ) : null}
                <Logo size={40} />
            </React.Fragment>
        )}>
            <Button onClick={onLoad}>{<Icon icon="folder-open" text="Load" />}</Button>
            <Spacer />
            <Button onClick={onSave}>{<Icon icon="save" text="Save" />}</Button>
            <Spacer />
            <Button onClick={onBackup}>{<Icon icon="save" text="Backup" />}</Button>
            <Spacer />
            <Button onClick={onCleanBackups}>{<Icon icon="save" text="Clean backups" />}</Button>
            <Spacer />
            <Button onClick={onSynchronize}>{<Icon icon="cogs" text="Synchronize" />}</Button>
            <Spacer />
            <Button onClick={onSetSettingsVisible}>{<Icon icon="cog" text="Settings" />}</Button>
            <Spacer />
            <Button onClick={onSetCategoryManagerVisible}>{<Icon icon="cubes" text="Category Manager" />}</Button>
            <Spacer />
            <Button onClick={onSetFilterManagerVisible}>{<Icon icon="filter" text="Filter Manager" />}</Button>
        </LeftRight>
    );
}

Header.propTypes = {
    pro: PropTypes.bool.isRequired,
    loadData: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    backupData: PropTypes.func.isRequired,
    cleanBackups: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired,
    setSettingsVisible: PropTypes.func.isRequired,
    setCategoryManagerOptions: PropTypes.func.isRequired,
    setFilterManagerOptions: PropTypes.func.isRequired
};

export default withApp(Header);