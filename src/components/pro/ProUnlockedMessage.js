import React from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';

export function ProUnlockedMessage({ activationInfo }) {
    return (
        <Empty
            image={(<Icon color={Constants.fadeIconColor} icon="lock-open" size={64} />)}
            description={(
                <span>
                    TaskUnifier Pro has been successfully activated !<br />
                    <strong>Email: </strong>{activationInfo.email}<br />
                    {activationInfo.expirationDate && (
                        <React.Fragment>
                            <strong>Expiration Date: </strong>{activationInfo.expirationDate}<br />
                        </React.Fragment>
                    )}
                </span>
            )} />
    );
}

ProUnlockedMessage.propTypes = {
    activationInfo: PropTypes.object
};

export default ProUnlockedMessage;