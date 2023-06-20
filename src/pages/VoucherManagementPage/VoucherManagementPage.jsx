import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';

import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CHEVRON from '../../assets/chevron-down.svg';
import CLOSE from '../../assets/close.svg';
import SEARCH from '../../assets/search.svg';
import ROUTE from '../../assets/taxi.svg';
import COLORS from '../../constant/color';

import axios from 'axios';
import { toast } from 'react-toastify';
import CenteredModal from '../../components/CenteredModal/CenteredModal';
import { API_ENDPOINT } from '../../constant/api';
import { selectBasicInformation } from '../../features/staffSlice';
import useCreateVoucher from '../../hooks/useCreateVoucher';
import usePersistentState from '../../hooks/usePersistentState';
import useTouristRoute from '../../hooks/touristRoute/useTouristRoute';
import styles from './VoucherManagementPage.module.scss';
import useVoucherList from '../../hooks/useVoucherList';
import { VOUCHER_COLUMN } from '@/constant/dataGridColumns';
import { DataGrid } from '@mui/x-data-grid';
import ImageButton from '@/components/ImageButton/ImageButton';
import ExportButton from '@/components/ExportButton/ExportButton';

export default function VoucherManagementPage() {
    const navigate = useNavigate();
    const companyInfo = useSelector(selectBasicInformation);

    const { createVoucher, data: createdData, error: createdError } = useCreateVoucher();

    const searchRef = useRef();
    const [searchValue, setSearchValue] = usePersistentState('tour-route-search', '');

    const [expiredAt, setExpiredAt] = useState(new Date());
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [usingCondition, setUsingCondition] = useState('');
    const [type, setType] = useState('');
    const [image, setImage] = useState();
    const [value, setValue] = useState(0);
    const [num, setNum] = useState();

    const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

    const { data, isError, error } = useVoucherList({ num: 1000 });

    useEffect(() => {
        if (isError) {
            toast(`An error occur when retrieve create voucher: ${error.message}`);
        }
    }, [isError]);

    useEffect(() => {
        if (createdError) toast.error(`Fail to create voucher: ${createdError.message}`);
    }, [createdError]);

    useEffect(() => {
        if (createdData) toast.success('Successfully create voucher');
    }, [createdData]);

    async function handleSubmit() {
        setIsOpenCreateBox(false);

        const data = {
            companyId: companyInfo.companyId,
            name,
            value: value / 100,
            num,
            description,
            usingCondition,
            expiredAt,
            type,
            ...(image
                ? {
                      image: {
                          originalname: image.name,
                          buffer: await image.arrayBuffer(),
                      },
                  }
                : {}),
        };

        createVoucher(data);
    }

    return (
        <>
            <div className={styles.container}>
                <h1>Manage voucher</h1>
                <div style={{ display: 'flex', gap: 20 }}>
                    <ImageButton onClick={() => setIsOpenCreateBox(true)}>
                        Create new voucher
                    </ImageButton>
                    <ExportButton data={data} columns={VOUCHER_COLUMN} fileName={`Voucher data`} />
                </div>
                <div className={styles.data}>
                    <DataGrid
                        rows={data || []}
                        columns={VOUCHER_COLUMN}
                        getRowId={(row) => row._id}
                        onCellClick={({ row, field }) => {
                            const id = row._id;
                            if (field != '__check__') {
                                handleEdit(id);
                            }
                            if (selectedIDs.includes(id)) {
                                setSelectedIDs((prev) => [...prev.filter((d) => d != id)]);
                            } else {
                                setSelectedIDs((prev) => [...prev, id]);
                            }
                        }}
                        onColumnHeaderClick={({ field }) => {
                            if (field == '__check__')
                                if (selectedIDs.length == 0) {
                                    setSelectedIDs(tours.map((row) => row._id));
                                } else {
                                    setSelectedIDs([]);
                                }
                        }}
                    />
                    {/* <div className={styles.table}>
                        <div className={styles.line}>
                            <p>Name</p>
                            <p>Type</p>
                            <p>Value</p>
                            <p>Num</p>
                        </div>
                        {data?.map(({ name, type, value, num }, index) => (
                            <div key={index}>
                                <hr />
                                <div
                                    onClick={() => {
                                        navigate(_id);
                                    }}
                                    className={styles.line}
                                >
                                    <p>{name}</p>
                                    <p>{type}</p>
                                    <p>{value}</p>
                                    <p>{num}</p>
                                </div>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>
            <CenteredModal isOpen={isOpenCreateBox} onClose={() => setIsOpenCreateBox(false)}>
                <div className={styles.createBox}>
                    <h1>Create new route</h1>
                    <div className={styles.form}>
                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Voucher name"
                            variant="standard"
                        />
                        <TextField
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            type="range"
                            min="0"
                            max="100"
                            label={`Voucher value (${value}%)`}
                            helperText="%"
                            variant="standard"
                        />
                        <TextField
                            value={num}
                            onChange={(e) => setNum(e.target.value)}
                            type="number"
                            label="Voucher quantity"
                            helperText="Number of voucher"
                            variant="standard"
                        />
                        <TextField
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            label="Description"
                            multiline
                            variant="standard"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Expired at"
                                onChange={(d) => setExpiredAt(new Date(d.$d))}
                            />
                        </LocalizationProvider>
                        <TextField
                            value={usingCondition}
                            onChange={(e) => setUsingCondition(e.target.value)}
                            label="Using condition"
                            multiline
                            variant="standard"
                        />
                        <div className={styles.imagePreview}>
                            {image ? <img src={URL.createObjectURL(image)} /> : null}
                        </div>
                        <Input
                            type="file"
                            inputProps={{ multiple: false }}
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Age"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <MenuItem value={'discount'}>Discount</MenuItem>
                                <MenuItem value={'free'}>Free</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            backgroundColor: COLORS.primary,
                            borderRadius: '8px',
                            height: '40px',
                            width: '100%',
                        }}
                    >
                        <p className={styles.buttonText}>Submit</p>
                    </Button>
                </div>
            </CenteredModal>
        </>
    );
}
