import React from 'react';
import Logo from 'components/common/Logo';
import Spacer from 'components/common/Spacer';

function Footer(props) {
    return (
        <React.Fragment>
            <span>
                <Logo size={12} />
                <Spacer size={3} />
                TaskUnifier 2 &copy; 2019 Created by BL-IT
            </span>
        </React.Fragment>
    );
}

export default Footer;