import React from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';

export function ProUnlockedMessage({ license }) {
    return (
        <Empty
            image={(<Icon color={Constants.fadeColor} icon="lock-open" size={64} />)}
            description={(
                <React.Fragment>
                    <p>TaskUnifier pro has been successfully activated !</p>
                    <p><strong>Owner: </strong>{license.firstname} {license.lastname}</p>
                    <p><strong>Email: </strong>{license.email}</p>
                </React.Fragment>
            )} />
    );
}

ProUnlockedMessage.propTypes = {
    license: PropTypes.object
};

export default ProUnlockedMessage;