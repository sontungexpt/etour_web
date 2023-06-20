import * as XLSX from 'xlsx';

export default function useExportData(columns, data, fileName = 'data') {
    function exportData() {
        const finalData = [columns.map((row) => row.headerName)];
        data.forEach((d) => finalData.push(columns.reduce((arr, c) => [...arr, d[c.field]], [])));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(finalData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    return exportData;
}
