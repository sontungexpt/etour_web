export default function useStaffPermission() {
    const staffInfo = JSON.parse(localStorage.getItem('staff-info', {}));

    const permissions = staffInfo?.permissions || [];

    function hasPermission(permission) {
        return permissions.includes(permission);
    }

    return { permissions, hasPermission };
}
