import React from 'react';
import styles from './ReportIssuePage.module.scss';
import { Button, Input, TextField } from '@mui/material';
import axios from 'axios';
import { API } from '@/constant/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ReportIssuePage = () => {
    const [issue, setIssue] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const handleReport = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API.base}/report`, {
                reportType: 'application',
                content: issue,
            });
            toast.success("Thank you for your report. You're helping us improve our service");
            navigate('/');
        } catch (e) {
            toast.error(e.response.data.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.container}>
            <h2>Report an issue</h2>
            <div>
                <Input
                    placeholder="Enter issue description"
                    fullWidth
                    multiline
                    onChange={(e) => setIssue(e.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    disabled={issue === '' || loading}
                    onClick={handleReport}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default ReportIssuePage;
