import React, { useEffect, useState } from 'react';
import { Alert, Spin } from 'antd';
import PropTypes from 'prop-types';

function ScriptLoader({ children, uniqueId, script }) {
    const [result, setResult] = useState(null);

    useEffect(() => {
        const loadScript = (uniqueId, src) => new Promise((resolve, reject) => {
            const scriptElement = document.getElementById(uniqueId);

            if (scriptElement) {
                resolve();
                return;
            }

            const script = document.createElement('script');

            script.src = src;
            script.id = uniqueId;

            script.addEventListener('load', resolve, { once: true });
            script.addEventListener('error', reject, { once: true });

            document.head.appendChild(script);
        });

        const fetchData = async () => {
            try {
                await loadScript(uniqueId, script);
                setResult(true);
            } catch (error) {
                setResult(false);
            }
        };

        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (result === true) {
        return children;
    }

    if (result === false) {
        return (<Alert type="error" message="Error while loading script" />);
    }

    return (<Spin tip="Loading script..." />);
}

ScriptLoader.propTypes = {
    children: PropTypes.node,
    uniqueId: PropTypes.string.isRequired,
    script: PropTypes.string.isRequired
};

export default ScriptLoader;