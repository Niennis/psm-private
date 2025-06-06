// ScrollContainer.js
'use client'

import { Scrollbars } from 'react-custom-scrollbars-2';

const ScrollContainer = ({ children }) => (
  <Scrollbars
    autoHide={true}
    autoHideTimeout={1000}
    autoHideDuration={200}
    style={{ height: '100vh' }}
    renderThumbVertical={props => (
      <div
        {...props}
        style={{
          backgroundColor: '#2e37a4',
          borderRadius: '4px',
          width: '8px'
        }}
      />
    )}
  >
    {children}
  </Scrollbars>
);

export default ScrollContainer;
