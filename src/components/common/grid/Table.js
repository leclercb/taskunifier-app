let TIMEOUT = null;

export const onRowOnClick = (record, dataSource, rowKey, selectedRowKeys, onSelectionChange) => event => {
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

        selectedRowKeys = [...selectedRowKeys];

        if (selectedRowKeys.includes(record[rowKey])) {
            if (ctrlKey) {
                selectedRowKeys.splice(selectedRowKeys.indexOf(record[rowKey]), 1);
            } else {
                selectedRowKeys = selectedRowKeys.length > 1 ? [record[rowKey]] : [];
            }
        } else {
            if (ctrlKey) {
                selectedRowKeys.push(record[rowKey]);
            } else {
                selectedRowKeys = [record[rowKey]];
            }
        }

        onSelectionChange(selectedRowKeys, selectedRowKeys.map(selectedRowKey => dataSource.find(record => record[rowKey] === selectedRowKey)));

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

export const onRowOnKeyDown = (dataSource, rowKey, selectedRowKeys, onSelectionChange) => event => {
    if (selectedRowKeys.length > 0) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();

            for (let i = 0; i < dataSource.length; i++) {
                if (dataSource[i][rowKey] === selectedRowKeys[selectedRowKeys.length - 1]) {
                    let index = event.key === 'ArrowDown' ? i + 1 : i - 1;
                    index = index < 0 ? 0 : index >= dataSource.length ? dataSource.length - 1 : index;

                    selectedRowKeys = [dataSource[index][rowKey]];
                    onSelectionChange(selectedRowKeys, selectedRowKeys.map(selectedRowKey => dataSource.find(record => record[rowKey] === selectedRowKey)));
                    break;
                }
            }
        }
    }
};