import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import withStatus from '../../containers/WithStatus';

function Status(props) {
    const notificationIndexes = useRef([]);

    const getLevelFromStatus = status => {
        switch (status) {
            case 'RUNNING':
                return 'loading';
            case 'COMPLETED':
                return 'success';
            case 'ERROR':
            default:
                return 'error';
        }
    }

    useEffect(() => {
        if (notificationIndexes.current.contains()) {

        }
    });

    return null;
}

Status.propTypes = {
    status: PropTypes.object.isRequired
};

export default withStatus(Status);