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

    const [form, setForm] = useState({
        name: '',
        description: '',
        usingCondition: '',
        type: 'percent',
        image: '',
        value: 1,
        num: 1,
        expiredAt: new Date(),
    });

    const onInputChange = (e) => {
        if (!e.target) {
            setForm((prev) => ({ ...prev, expiredAt: new Date(e.$d) }));
            return;
        }
        const { name, value, label } = e.target;
        if (name === 'type') {
            setForm((prev) => ({ ...prev, value }));
        }
        if (name === 'image') {
            setForm((prev) => ({ ...prev, image: e.target.files[0] }));
            return;
        }
        if (name === 'backgroundImage') {
            setForm((prev) => ({ ...prev, backgroundImage: e.target.files[0] }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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
            name: form.name,
            value: form.type == 'percent' ? form.value / 100 : form.value,
            num: form.num,
            min: form.min,
            max: form.max,
            description: form.description,
            usingCondition: form.usingCondition,
            expiredAt: form.expiredAt,
            type: form.type,
            ...(form.image
                ? {
                      image: {
                          originalname: form.image.name,
                          buffer: await form.image.arrayBuffer(),
                      },
                  }
                : {}),
            ...(form.backgroundImage
                ? {
                      backgroundImage: {
                          originalname: form.backgroundImage.name,
                          buffer: await form.backgroundImage.arrayBuffer(),
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
                            value={form.name}
                            onChange={onInputChange}
                            label="Voucher name"
                            variant="standard"
                            name="name"
                        />
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Age"
                                value={form.type}
                                name="type"
                                onChange={onInputChange}
                            >
                                <MenuItem value={'money'}>Money</MenuItem>
                                <MenuItem value={'percent'}>Percent</MenuItem>
                            </Select>
                        </FormControl>
                        {form.type === 'money' && (
                            <TextField
                                value={form.value}
                                onChange={onInputChange}
                                type="number"
                                label="Voucher value"
                                helperText="Unit: VND"
                                variant="standard"
                                name="value"
                            />
                        )}
                        {form.type === 'percent' && (
                            <TextField
                                value={form.value}
                                onChange={onInputChange}
                                type="range"
                                min="0"
                                max="100"
                                label={`Voucher value (${form.value}%)`}
                                helperText="%"
                                variant="standard"
                                name="value"
                            />
                        )}
                        <TextField
                            value={form.min}
                            name="min"
                            onChange={onInputChange}
                            type="number"
                            label="Min applied value"
                            helperText="Min applied value"
                            variant="standard"
                        />
                        <TextField
                            value={form.max}
                            name="max"
                            onChange={onInputChange}
                            type="number"
                            label="Max applied value"
                            helperText="Max applied value"
                            variant="standard"
                        />
                        <TextField
                            value={form.num}
                            name="num"
                            onChange={onInputChange}
                            type="number"
                            label="Voucher quantity"
                            helperText="Number of voucher"
                            variant="standard"
                        />
                        <TextField
                            value={form.description}
                            onChange={onInputChange}
                            label="Description"
                            multiline
                            variant="standard"
                            name="description"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Expired at"
                                name="expiredAt"
                                onChange={onInputChange}
                                closeOnSelect
                                disablePast
                            />
                        </LocalizationProvider>
                        <TextField
                            value={form.usingCondition}
                            onChange={onInputChange}
                            label="Using condition"
                            multiline
                            variant="standard"
                            name="usingCondition"
                        />
                        <p className={styles.title}>Image</p>
                        <div className={styles.imagePreview}>
                            {form.image ? <img src={URL.createObjectURL(form.image)} /> : null}
                        </div>
                        <Input
                            type="file"
                            name="image"
                            inputProps={{ multiple: false }}
                            onChange={onInputChange}
                        />
                        <p className={styles.title}>Background image</p>
                        <div className={styles.imagePreview}>
                            {form.backgroundImage ? (
                                <img src={URL.createObjectURL(form.backgroundImage)} />
                            ) : null}
                        </div>
                        <Input
                            type="file"
                            name="backgroundImage"
                            inputProps={{ multiple: false }}
                            onChange={onInputChange}
                        />
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
