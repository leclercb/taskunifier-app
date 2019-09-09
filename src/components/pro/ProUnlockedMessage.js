import React from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';

export function ProUnlockedMessage({ license }) {
    return (
        <Empty
            image={(<Icon color={Constants.fadeIconColor} icon="lock-open" size={64} />)}
            description={(
                <span>
                    TaskUnifier Pro has been successfully activated !<br />
                    <strong>Item: </strong>{license.itemName}<br />
                    <strong>Owner: </strong>{license.firstName} {license.lastName}<br />
                    <strong>Email: </strong>{license.email}
                </span>
            )} />
    );
}

ProUnlockedMessage.propTypes = {
    license: PropTypes.object
};

export default ProUnlockedMessage;