import React from 'react';
import { Button } from 'antd';
import Icon from '../common/Icon';
import withApp from '../../containers/WithApp';

function HeaderMenu(props) {
    const onClick = () => {
        props.synchronize();
    };

    return (
        <Button onClick={onClick}>{<Icon icon="cogs" text="Synchronize" />}</Button>
    );
}

export default withApp(HeaderMenu);