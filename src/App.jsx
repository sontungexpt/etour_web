import { useState } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { STATUS } from './constant/status';
import SocketContext from './contexts/SocketContext';
import router from './routers/mainNavigator';
import store from './store';

function App() {
    const [socket, setSocket] = useState();
    const [socketStatus, setSocketStatus] = useState(STATUS.IDLE);

    return (
        <SocketContext.Provider value={{ socket, setSocket, socketStatus, setSocketStatus }}>
            <Provider store={store}>
                <RouterProvider router={router} />
                <ToastContainer
                    position="top-center"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </Provider>
        </SocketContext.Provider>
    );
}

export default App;
