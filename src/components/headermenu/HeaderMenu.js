import React from 'react';
import { Button, Menu } from 'antd';
import Icon from '../common/Icon';
import withApp from '../../containers/WithApp';

function HeaderMenu(props) {
    const onClick = () => {
        props.synchronize();
    };

    return (
        <Button onClick={onClick}>{<span><Icon icon="cogs" /><span>Synchronize</span></span>}</Button>
    );
}

export default withApp(HeaderMenu);