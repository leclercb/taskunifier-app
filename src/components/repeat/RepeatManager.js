import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import RepeatDailyForm from 'components/repeat/RepeatDailyForm';
import RepeatWeeklyForm from 'components/repeat/RepeatWeeklyForm';
import RepeatMonthlyForm from 'components/repeat/RepeatMonthlyForm';
import RepeatYearlyForm from 'components/repeat/RepeatYearlyForm';
import RepeatWithParentForm from 'components/repeat/RepeatWithParentForm';

function RepeatManager(props) {
    return (
        <Tabs animated={false}>
            <Tabs.TabPane tab="Daily" key="daily">
                <RepeatDailyForm repeat={props.repeat} onUpdateRepeat={props.onUpdateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Weekly" key="weekly">
                <RepeatWeeklyForm repeat={props.repeat} onUpdateRepeat={props.onUpdateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Monthly" key="monthly">
                <RepeatMonthlyForm repeat={props.repeat} onUpdateRepeat={props.onUpdateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Yearly" key="yearly">
                <RepeatYearlyForm repeat={props.repeat} onUpdateRepeat={props.onUpdateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="With Parent" key="withparent">
                <RepeatWithParentForm repeat={props.repeat} onUpdateRepeat={props.onUpdateRepeat} />
            </Tabs.TabPane>
        </Tabs>
    );
}

RepeatManager.propTypes = {
    repeat: PropTypes.string.isRequired,
    onUpdateRepeat: PropTypes.func.isRequired
};

export default RepeatManager;