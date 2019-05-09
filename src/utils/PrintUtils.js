import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

const TASKUNIFIER_LOGO = 'data:image/png;base64,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';
const DEFAULT_START_Y = 160;

export function _printDocument(title, orientation = 'p') {
    const doc = new jsPDF(orientation, 'pt');

    doc.setFont('helvetica');

    // Light blue rectangle
    doc.setDrawColor(0);
    doc.setFillColor(51, 153, 204);
    doc.rect(0, 50, doc.internal.pageSize.getWidth(), 100, 'F');

    // Dark blue rectangle
    doc.setDrawColor(0);
    doc.setFillColor(2, 69, 112);
    doc.rect(0, 120, doc.internal.pageSize.getWidth() - 50, 30, 'F');

    // ***REMOVED*** Logo
    doc.addImage(TASKUNIFIER_LOGO, 'PNG', doc.internal.pageSize.getWidth() - 110, 10, 85, 90);

    // TaskUnifier
    doc.setFontSize(14);
    doc.setFontType('bold');
    doc.setTextColor(51, 153, 204);
    doc.text(50, 30, 'TaskUnifier');

    // Title
    doc.setFontSize(14);
    doc.setFontType('bold');
    doc.setTextColor(0, 0, 0);
    doc.text(140, 30, title);

    // Print Date
    doc.setFontSize(8);
    doc.setFontType('normal');
    doc.setTextColor(0, 0, 0);

    const printDateMsg = 'Print date: ' + moment(new Date()).format('DD-MM-YYYY HH:mm:ss');

    doc.text(
        doc.internal.pageSize.getWidth() - (doc.getStringUnitWidth(printDateMsg) * 8) - 20,
        doc.internal.pageSize.getHeight() - 20,
        printDateMsg);

    // Default start y
    if (doc.autoTable.previous.finalY) {
        doc.autoTable.previous.finalY = DEFAULT_START_Y;
    }

    return doc;
}

export function _printForm(doc, title, fields, props, subLevel = 0) {
    let startY = doc.autoTable.previous.finalY ? doc.autoTable.previous.finalY : DEFAULT_START_Y;

    if (startY > doc.internal.pageSize.getHeight() - (80 + (title ? 30 : 0))) {
        doc.addPage();
        startY = title ? 20 : 0;
    }

    if (title) {
        doc.setFont('helvetica');
        doc.setFontSize(11);
        doc.setFontType('normal');
        doc.setTextColor(51, 153, 204);
        doc.text(title, 20, startY + 30);
    }

    doc.autoTable(
        [
            {
                title: 'Field',
                dataKey: 'key'
            },
            {
                title: 'Value',
                dataKey: 'value'
            }
        ],
        getKeyValueDataFromFields(typeof fields === 'function' ? fields(props) : fields, props.data),
        {
            showHeader: 'everyPage',
            headerStyles: {
                fontSize: subLevel === 0 ? 9 : 8,
                cellPadding: subLevel === 0 ? 5 : [1, 5, 1, 5],
                fillColor: subLevel === 0 ? [51, 153, 204] : [170, 170, 170]
            },
            bodyStyles: {
                fontSize: 9
            },
            startY: Math.max(startY + (subLevel === 0 ? 50 : 0), 50),
            margin: { top: 40, left: 40 + subLevel * 30 }
        });
}

export function _printTable(doc, title, columns, records, subLevel = 0, printSubTable, options = {}) {
    let startY = doc.autoTable.previous.finalY ? doc.autoTable.previous.finalY : DEFAULT_START_Y;

    if (startY > doc.internal.pageSize.getHeight() - (80 + (title ? 30 : 0))) {
        doc.addPage();
        startY = title ? 20 : 0;
    }

    if (title) {
        doc.setFont('helvetica');
        doc.setFontSize(11);
        doc.setFontType('normal');
        doc.setTextColor(51, 153, 204);
        doc.text(title, 20, startY + 30);
    }

    let autoTableColumns = columns.map((column, index) => {
        return {
            title: column.titleAsText ? column.titleAsText : column.title,
            dataKey: 'column_' + index
        };
    });

    let autoTableRecords = _getTableData(columns, records);

    let opt = {
        showHeader: 'everyPage',
        headerStyles: {
            fontSize: subLevel === 0 ? 9 : 8,
            cellPadding: subLevel === 0 ? 5 : [1, 5, 1, 5],
            fillColor: subLevel === 0 ? [51, 153, 204] : [170, 170, 170]
        },
        bodyStyles: {
            fontSize: 9
        },
        startY: Math.max(startY + (subLevel === 0 ? 50 : 0), 50),
        margin: { top: 40, left: 40 + subLevel * 30 }
    };

    opt = merge(options, opt);

    if (printSubTable) {
        autoTableRecords.forEach((record, index) => {
            opt.showHeader = index === 0 ? opt.showHeader : 'never';
            opt.startY = index === 0 ? opt.startY : doc.autoTable.previous.finalY;

            doc.autoTable(
                autoTableColumns,
                [record],
                opt);

            printSubTable(records[index]);
        });
    } else {
        doc.autoTable(
            autoTableColumns,
            autoTableRecords,
            opt);
    }
}

export function _getTableData(columns, records) {
    return (records ? records : []).map((record, recordIndex) => {
        let value = {};

        columns.forEach((column, columnIndex) => {
            value['column_' + columnIndex] = getKeyValueDataFromColumn(column, record, recordIndex).value;
        });

        return value;
    });
}

export function _getTableDataAsString(columns, records) {
    let data = _getTableData(columns, records);

    let results = [];

    data.forEach(item => {
        let values = [];

        for (var key in item) {
            values.push(item[key]);
        }

        results.push(values.join(' - '));
    });

    return results.join('\n');
}
