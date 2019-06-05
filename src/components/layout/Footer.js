import React from 'react';
import Logo from 'components/common/Logo';
import Spacer from 'components/common/Spacer';

function Footer() {
    return (
        <React.Fragment>
            <span>
                <Logo size={12} />
                <Spacer size={3} />
                TaskUnifier &copy; 2019 Created by BL-IT
            </span>
        </React.Fragment>
    );
}

export default Footer;