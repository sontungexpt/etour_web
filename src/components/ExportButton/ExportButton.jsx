import useExportData from '@/hooks/useExportData';
import ImageButton from '../ImageButton/ImageButton';
import { ReactComponent as DOWNLOAD_ICON } from '@/assets/download.svg';

export default function ExportButton({ data, columns, fileName = 'data' }) {
    const exportData = useExportData(columns, data, fileName);

    return (
        <ImageButton
            icon={DOWNLOAD_ICON}
            backgroundColor={'#ebd7f3'}
            color={'#a20edd'}
            onClick={exportData}
        >
            Export
        </ImageButton>
    );
}
