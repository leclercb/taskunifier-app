let TIMEOUT = null;

export const multiSelectionHandler = (getId, selectedIds, setSelectedIds) => ({ event, rowData }) => {
    const rowId = getId(rowData);
    const ctrlKey = event.ctrlKey || event.metaKey;
    let dataPreventDefault = false;

    if (event.target.attributes.getNamedItem('data-prevent-default') &&
        event.target.attributes.getNamedItem('data-prevent-default').value === 'true') {
        dataPreventDefault = true;
    } else if (event.target.nodeName === 'path') {
        dataPreventDefault = true;
    }

    if (document &&
        document.activeElement &&
        document.activeElement !== document.body &&
        document.activeElement.className !== 'ReactVirtualized__Table__row') {
        return;
    }

    if (dataPreventDefault) {
        return;
    }

    const fn = ctrlKey => {
        TIMEOUT = null;

        selectedIds = [...selectedIds];

        if (selectedIds.includes(rowId)) {
            if (ctrlKey) {
                selectedIds.splice(selectedIds.indexOf(rowId), 1);
            } else {
                selectedIds = selectedIds.length > 1 ? [rowId] : [];
            }
        } else {
            if (ctrlKey) {
                selectedIds.push(rowId);
            } else {
                selectedIds = [rowId];
            }
        }

        setSelectedIds(selectedIds);
    };

    if (TIMEOUT) {
        clearTimeout(TIMEOUT);
        TIMEOUT = null;
    } else {
        TIMEOUT = setTimeout(() => fn(ctrlKey), 200);
        return;
    }
};