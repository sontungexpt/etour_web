import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: IState = {
    staff: undefined,
    isLoggedIn: false,
};

interface IState {
    staff?: IStaffInformation;
    isLoggedIn: boolean;
}

export interface IStaffInformation {
    _id: string;
    fullName: string;
    role: string;
    permissions: string[];
    companyId: string;
}

export const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        setBasicInformation(
            state,
            action: PayloadAction<{
                staff: IStaffInformation;
            }>
        ) {
            state.staff = action.payload.staff;
            state.isLoggedIn = true;
        },
        afterSignOut(state) {
            state.staff = undefined;
            state.isLoggedIn = false;
        },
    },
});

export const { setBasicInformation, afterSignOut } = staffSlice.actions;

export const selectBasicInformation = (state: RootState): IStaffInformation => state.staff.staff;
export const selectLoginState = (state: RootState): boolean => state.staff.isLoggedIn;

export default staffSlice.reducer;
