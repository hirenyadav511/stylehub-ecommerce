import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 2000 }}>
          <div className="toast show align-items-center text-white bg-dark border-0 shadow" role="alert">
            <div className="d-flex">
              <div className="toast-body py-3 px-4 text-uppercase tracking-widest small fw-bold">
                <i className="fa fa-check-circle me-2 text-success"></i>
                {toast}
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => setToast(null)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
