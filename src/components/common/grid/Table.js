import React from 'react';
import { InfinityTable } from 'antd-table-infinity';

let TIMEOUT = null;

function Table(props) {
    const onClick = (record) => event => {
        const ctrlKey = event.ctrlKey;
        let dataPreventDefault = false;

        if (event.target.attributes.getNamedItem('data-prevent-default') &&
            event.target.attributes.getNamedItem('data-prevent-default').value === 'true') {
            dataPreventDefault = true;
        } else if (event.target.nodeName === 'path') {
            dataPreventDefault = true;
        }

        const fn = (dataPreventDefault, ctrlKey) => {
            TIMEOUT = null;

            // Return if the user clicked on a focusable element.
            // There is no "focusable" property, so we check that the activeElement is the target element.
            if (document && document.activeElement && document.activeElement !== document.body) {
                return;
            }

            if (dataPreventDefault) {
                return;
            }

            let selectedRowKeys = [...props.rowSelection.selectedRowKeys];

            if (selectedRowKeys.includes(record[props.rowKey])) {
                if (ctrlKey) {
                    selectedRowKeys.splice(selectedRowKeys.indexOf(record[props.rowKey]), 1);
                } else {
                    selectedRowKeys = selectedRowKeys.length > 1 ? [record[props.rowKey]] : [];
                }
            } else {
                if (ctrlKey) {
                    selectedRowKeys.push(record[props.rowKey]);
                } else {
                    selectedRowKeys = [record[props.rowKey]];
                }
            }

            props.rowSelection.onChange(selectedRowKeys, selectedRowKeys.map(selectedRowKey => props.dataSource.find(record => record[props.rowKey] === selectedRowKey)));

            if (selectedRowKeys.length > 0) {
                try {
                    document.evaluate(
                        '//tr[@data-row-key=\'' + selectedRowKeys[selectedRowKeys.length - 1] + '\']/td[contains(@class, \'ant-table-selection-column\')]//input',
                        document,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null).singleNodeValue.focus();
                } catch (e) {
                    // Couldn't focus the selection input
                    // The focus is needed for the onKeyDown listener to work
                }
            }
        };

        if (TIMEOUT) {
            clearTimeout(TIMEOUT);
            TIMEOUT = null;
        } else {
            TIMEOUT = setTimeout(() => fn(dataPreventDefault, ctrlKey), 200);
            return;
        }
    };

    const onKeyDown = () => event => {
        let selectedRowKeys = props.rowSelection.selectedRowKeys;

        if (selectedRowKeys.length > 0) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();

                for (let i = 0; i < props.dataSource.length; i++) {
                    if (props.dataSource[i][props.rowKey] === selectedRowKeys[selectedRowKeys.length - 1]) {
                        let index = event.key === 'ArrowDown' ? i + 1 : i - 1;
                        index = index < 0 ? 0 : index >= props.dataSource.length ? props.dataSource.length - 1 : index;

                        selectedRowKeys = [props.dataSource[index][props.rowKey]];
                        props.rowSelection.onChange(selectedRowKeys, selectedRowKeys.map(selectedRowKey => props.dataSource.find(record => record[props.rowKey] === selectedRowKey)));

                        break;
                    }
                }
            }
        }
    };

    const wrappedProps = { ...props };

    wrappedProps.onRow = (record, index) => {
        let onRow = {};

        if (props.onRow) {
            onRow = props.onRow(record, index);
        }

        onRow.onClick = onClick(record);
        onRow.onKeyDown = onKeyDown();

        return onRow;
    };

    return <InfinityTable {...wrappedProps} />;
};

export default Table;