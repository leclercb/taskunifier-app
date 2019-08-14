import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { checked, logo } from 'constants/Images';
import { getToStringForType } from 'data/DataFieldTypes';
import { merge } from 'utils/ObjectUtils';

const DEFAULT_START_Y = 30;

export function printDocument(title, orientation = 'p') {
    const doc = new jsPDF(orientation, 'pt');

    doc.setFont('helvetica');

    // Blue rectangle
    doc.setDrawColor(0);
    doc.setFillColor(14, 103, 196);
    doc.rect(0, 50, doc.internal.pageSize.getWidth(), 10, 'F');

    // TaskUnifier Logo
    doc.addImage(logo, 'PNG', doc.internal.pageSize.getWidth() - 50, 10, 32, 32);

    // TaskUnifier
    doc.setFontSize(14);
    doc.setFontType('bold');
    doc.setTextColor(14, 103, 196);
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

export function printForm(doc, title, fields, record, state, subLevel = 0) {
    let startY = doc.autoTable.previous.finalY ? doc.autoTable.previous.finalY : DEFAULT_START_Y;

    if (startY > doc.internal.pageSize.getHeight() - (80 + (title ? 30 : 0))) {
        doc.addPage();
        startY = title ? 20 : 0;
    }

    if (title) {
        doc.setFont('helvetica');
        doc.setFontSize(11);
        doc.setFontType('normal');
        doc.setTextColor(0, 140, 75);
        doc.text(title, 20, startY + 30);
    }

    doc.autoTable(
        {
            showHead: 'everyPage',
            columns: [
                {
                    header: 'Field',
                    dataKey: 'key'
                },
                {
                    header: 'Value',
                    dataKey: 'value'
                }
            ],
            headStyles: {
                fontSize: subLevel === 0 ? 8 : 7,
                cellPadding: subLevel === 0 ? 3 : [1, 3, 1, 3],
                fillColor: subLevel === 0 ? [0, 140, 75] : [170, 170, 170]
            },
            body: getFormData(fields, record, state),
            bodyStyles: {
                fontSize: 7
            },
            startY: Math.max(startY + (subLevel === 0 ? 50 : 0), 50),
            margin: { top: 40, left: 20 + subLevel * 30 }
        });
}

function getFormData(fields, record, state) {
    let value = {};

    fields.forEach(field => {
        value.key = field.title;
        value.value = getToStringForType(field.type, field.options, record[field.id], state);
    });

    return value;
}

export function printTable(doc, title, fields, records, state, subLevel = 0, printSubTable, extraOptions = {}) {
    let startY = doc.autoTable.previous.finalY ? doc.autoTable.previous.finalY : DEFAULT_START_Y;

    if (startY > doc.internal.pageSize.getHeight() - (80 + (title ? 30 : 0))) {
        doc.addPage();
        startY = title ? 20 : 0;
    }

    if (title) {
        doc.setFont('helvetica');
        doc.setFontSize(11);
        doc.setFontType('normal');
        doc.setTextColor(0, 140, 75);
        doc.text(title, 20, startY + 30);
    }

    let autoTableColumns = fields.map(field => {
        return {
            header: field.title,
            dataKey: field.id
        };
    });

    let autoTableRecords = getTableData(fields, records, state);

    let options = {
        showHead: 'everyPage',
        headStyles: {
            fontSize: subLevel === 0 ? 8 : 7,
            cellPadding: subLevel === 0 ? 3 : [1, 3, 1, 3],
            fillColor: subLevel === 0 ? [14, 103, 196] : [170, 170, 170]
        },
        bodyStyles: {
            fontSize: 7
        },
        startY: Math.max(startY + (subLevel === 0 ? 50 : 0), 50),
        margin: { top: 40, left: 20 + subLevel * 30 }
    };

    options = merge(extraOptions, options);

    if (printSubTable) {
        autoTableRecords.forEach((record, index) => {
            options.showHeader = index === 0 ? options.showHeader : 'never';
            options.startY = index === 0 ? options.startY : doc.autoTable.previous.finalY;

            doc.autoTable({
                columns: autoTableColumns,
                body: [record],
                ...options
            });

            printSubTable(records[index]);
        });
    } else {
        doc.autoTable({
            columns: autoTableColumns,
            body: autoTableRecords,
            didDrawCell: data => {
                const field = fields.find(field => field.id === data.column.dataKey);

                if (data.section === 'body') {
                    if (field.type === 'boolean' || field.type === 'star') {
                        if (records[data.row.index][field.id] === true) {
                            doc.addImage(checked, 'PNG', data.cell.x + 5, data.cell.y + 5, 10, 10);
                        }
                    }
                }
            },
            ...options
        });
    }
}

function getTableData(fields, records, state) {
    return (records ? records : []).map(record => {
        let row = {};

        fields.forEach(field => {
            let value = getToStringForType(field.type, field.options, record[field.id], state);

            if (field.type === 'boolean' || field.type === 'star') {
                value = '';
            }

            row[field.id] = value;
        });

        return row;
    });
}