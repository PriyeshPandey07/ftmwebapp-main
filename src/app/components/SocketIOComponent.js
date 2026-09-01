// SocketIOComponent.js

import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const SocketIOComponent = ({ endpoint, event, onEvent }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(endpoint);
    setSocket(socket);

    // Subscribe to the event
    socket.on(event, (data) => {
      onEvent(data);
    });

    return () => {
      // Unsubscribe and disconnect the socket when the component unmounts
      socket.off(event);
      socket.disconnect();
    };
  }, [endpoint, event, onEvent]);

  return null; // This component doesn't render anything; it handles socket events.
};

export default SocketIOComponent;
