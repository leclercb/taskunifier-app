import React from 'react';
import { useSelector } from 'react-redux';
import ProLockedMessage from 'components/pro/ProLockedMessage';
import { isPro } from 'selectors/AppSelectors';

function withProCheck(Component) {
    function WithProCheck(props) {
        const pro = useSelector(isPro);

        if (!pro) {
            return (
                <ProLockedMessage />
            );
        }

        return (
            <Component {...props} />
        );
    }

    return WithProCheck;
}

export default withProCheck;