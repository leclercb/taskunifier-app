import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import RepeatDailyForm from 'components/repeat/RepeatDailyForm';
import RepeatWeeklyForm from 'components/repeat/RepeatWeeklyForm';
import RepeatMonthlyForm from 'components/repeat/RepeatMonthlyForm';
import RepeatYearlyForm from 'components/repeat/RepeatYearlyForm';
import RepeatWithParentForm from 'components/repeat/RepeatWithParentForm';
import { RepeatPropType } from 'proptypes/RepeatPropTypes';
import { getCategoryForType } from 'utils/RepeatUtils';

function RepeatManager(props) {
    const activeKey = getCategoryForType(props.repeat ? props.repeat.type : null);

    return (
        <Tabs animated={false} defaultActiveKey={activeKey}>
            <Tabs.TabPane tab="Daily" key="daily">
                <RepeatDailyForm repeat={props.repeat} updateRepeat={props.updateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Weekly" key="weekly">
                <RepeatWeeklyForm repeat={props.repeat} updateRepeat={props.updateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Monthly" key="monthly">
                <RepeatMonthlyForm repeat={props.repeat} updateRepeat={props.updateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Yearly" key="yearly">
                <RepeatYearlyForm repeat={props.repeat} updateRepeat={props.updateRepeat} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="With Parent" key="withParent">
                <RepeatWithParentForm repeat={props.repeat} updateRepeat={props.updateRepeat} />
            </Tabs.TabPane>
        </Tabs>
    );
}

RepeatManager.propTypes = {
    repeat: RepeatPropType,
    updateRepeat: PropTypes.func.isRequired
};

export default RepeatManager;