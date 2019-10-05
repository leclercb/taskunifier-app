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
                    {(license.firstName || license.lastName) && (
                        <React.Fragment>
                            <strong>Owner: </strong>{license.firstName} {license.lastName}<br />
                        </React.Fragment>
                    )}
                    <strong>Email: </strong>{license.email}<br />
                    {license.expirationDate && (
                        <React.Fragment>
                            <strong>Expiration Date: </strong>{license.expirationDate}<br />
                        </React.Fragment>
                    )}
                </span>
            )} />
    );
}

ProUnlockedMessage.propTypes = {
    license: PropTypes.object
};

export default ProUnlockedMessage;