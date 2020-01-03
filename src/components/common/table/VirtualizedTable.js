let TIMEOUT = null;

export const multiSelectionHandler = (getId, items, selectedIds, setSelectedIds, rightClick = false) => ({ event, rowData }) => {
    const rowId = getId(rowData);
    const ctrlKey = event.ctrlKey || event.metaKey;
    const { shiftKey } = event;

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
        (!document.activeElement.className || (!document.activeElement.className.includes('ReactVirtualized__Grid') && !document.activeElement.className.includes('ReactVirtualized__Table__row')))) {
        return;
    }

    if (dataPreventDefault) {
        return;
    }

    const fn = (ctrlKey, shiftKey) => {
        TIMEOUT = null;

        selectedIds = [...selectedIds];

        if (shiftKey) {
            if (selectedIds.length === 0) {
                selectedIds = [rowId];
            } else {
                const fromIndex = items.findIndex(item => getId(item) === selectedIds[selectedIds.length - 1]);
                const toIndex = items.findIndex(item => getId(item) === rowId);

                selectedIds = items.filter((item, index) => {
                    if (fromIndex <= toIndex) {
                        return fromIndex <= index && index <= toIndex;
                    } else {
                        return toIndex <= index && index <= fromIndex;
                    }
                }).map(item => getId(item));
            }
        } else {
            if (selectedIds.includes(rowId)) {
                if (ctrlKey) {
                    selectedIds.splice(selectedIds.indexOf(rowId), 1);
                } else {
                    if (rightClick) {
                        return;
                    }

                    selectedIds = selectedIds.length > 1 ? [rowId] : [];
                }
            } else {
                if (ctrlKey) {
                    selectedIds.push(rowId);
                } else {
                    selectedIds = [rowId];
                }
            }
        }

        setSelectedIds(selectedIds);
    };

    if (TIMEOUT) {
        clearTimeout(TIMEOUT);
        TIMEOUT = null;
    } else {
        TIMEOUT = setTimeout(() => fn(ctrlKey, shiftKey), 200);
        return;
    }
};