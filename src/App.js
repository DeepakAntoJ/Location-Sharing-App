// import React, { useState, useEffect } from 'react';
// import { over } from 'stompjs';
// import SockJS from 'sockjs-client/dist/sockjs';
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer ,Marker } from "react-leaflet";
// import "./App.css";
// import { Icon } from "leaflet";
// let stompClient = null;

// const customIcon = new Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [38, 38] // size of the icon
// });


// const App = () => {
//   const [marker, setMarker] = useState(new Map());
//   const [userData, setUserData] = useState({
//     username: '',
//     recievername: '',
//     lati: '',
//     longi: '',
//     connected: false,
//   });
  
//   useEffect(()=>{
//     if (navigator.geolocation) {
//       navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;

//           setUserData(userData => ({ ...userData, lati: latitude, longi: longitude }));

//         },
//         (error) => {
//           console.log(error);
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 0,
//         },

//         console.log("im here")
//       );
//     } else {
//       alert("No geolocation available");
//     }
//   },[])

//   // register user
//   const registerUser = () => {
//     connect();
//   };

//   const connect = () => {
//     const sock = new SockJS('http://localhost:8090/ws');
//     stompClient = over(sock);

//     stompClient.connect({}, onConnect, onError);

//     // Add the beforeunload event listener to notify when the user leaves
//     window.addEventListener("beforeunload", handleUserLeave);
//   };

//   const handleUserLeave = () => {
//     if (stompClient) {
//       const chatMessage = {
//         userName: userData.username,
//         status: 'LEAVE',
//       };
//       stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
//       stompClient.disconnect();
//     }
//   };

//   const onConnect = () => {
//     setUserData((prevData) => ({ ...prevData, connected: true }));
//     stompClient.subscribe('/topic/messages', onPublicMessageReceived);
//     userJoin();
//   };

//   const onError = (error) => {
//     console.log(error);
//   };

//   const onPublicMessageReceived = (payload) => {
//     const payloadData = JSON.parse(payload.body);
//     switch (payloadData.status) {
//       case 'JOIN':
//         if (!marker.has(payloadData.userName)) {

//           const newMarker = new Map(marker);
//           newMarker.set(payloadData.userName, [payloadData.latitude, payloadData.longitude]);
//           setMarker(newMarker);
//           console.log([...newMarker.keys()]);
//         }
//         break;
//       case 'LEAVE':
//         // Remove user from marker when they leave
//         if (marker.has(payloadData.userName)) {
//           marker.delete(payloadData.userName);
//           setMarker(new Map(marker));
//           console.log(`${payloadData.userName} has left the chat.`);
//         }
//         break;
//       default:
//         break;
//     }
//   };

//   const userJoin = () => {
//     const chatMessage = {
//       latitude: userData.lati,
//       longitude: userData.longi,
//       userName: userData.username,
//       status: 'JOIN',
//     };
//     stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
//   };

//   const handleUsernameInput = (event) => {
//     const { value } = event.target;
    
//           setUserData(userData => ({ ...userData,username: value }));
//   };

//   return (
//     <div>
//       {userData.connected ? (
//         <div>
//           <MapContainer center={[20.5937,78.9629]} zoom={13}>
//       {/* OPEN STREEN MAPS TILES */}
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {[...marker.keys()].map((m, i) => (
//             <Marker key={m} icon={customIcon} position={marker.get(m)}>
//             </Marker>
//       ))}
//           </MapContainer>
//         </div>
//       ) : (
//         <div className="register">
//           <input
//             id="user-name"
//             placeholder="Enter your name"
//             name="userName"
//             value={userData.username}
//             onChange={handleUsernameInput}
//             margin="normal"
//           />
//           <button type="button" onClick={registerUser}>
//             Connect
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer ,Marker, Popup } from "react-leaflet";
import "./App.css";
import { Icon } from "leaflet";
let stompClient = null;


const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38] // size of the icon
});
const App = () => {

  const [marker, setMarker] = useState(new Map());
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    username : "",
    connected : false,
  });
  const [error, setError] = useState(null);
  
    // register user
  const registerUser = () => {
    connect();
  };

    const connect = () => {
    const sock = new SockJS('http://localhost:8090/ws');
    stompClient = over(sock);

    stompClient.connect({}, onConnect, onError);

    // Add the beforeunload event listener to notify when the user leaves
    window.addEventListener("beforeunload", handleUserLeave);
  };

    const onConnect = () => {
    setLocation((prevData) => ({ ...prevData, connected: true }));
    stompClient.subscribe('/topic/messages', onPublicMessageReceived);
    userJoin();
  };

    const onPublicMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case 'JOIN':
        if (!marker.has(payloadData.userName)) {

          marker.set(payloadData.userName, [payloadData.latitude, payloadData.longitude]);
          setMarker(new Map(marker));
          console.log([...marker.keys()]);
        }
        else{
          marker.set(payloadData.userName, [payloadData.latitude, payloadData.longitude]);
          setMarker(new Map(marker));
        }
        break;
      case 'LEAVE':
        // Remove user from marker when they leave
        if (marker.has(payloadData.userName)) {
          marker.delete(payloadData.userName);
          setMarker(new Map(marker));
          console.log(`${payloadData.userName} has left the chat.`);
        }
        break;
      default:
        break;
    }
  };



    const userJoin = () => {
    const chatMessage = {
      latitude: location.latitude,
      longitude: location.longitude,
      userName: location.username,
      status: 'JOIN',
    };
    stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
  };

  const onError = (error) => {
    console.log(error);
  };

  const handleUserLeave = () => {
    if (stompClient) {
      const chatMessage = {
        userName: location.username,
        status: 'LEAVE',
      };
      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
      stompClient.disconnect();
    }
  };


  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 2000,
    };

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setLocation((prevLocation) => ({
        ...prevLocation,
        latitude,
        longitude,
        accuracy: Math.round(accuracy),
      }));

    };

    const handleError = (err) => {
      if (err.code === 1) {
        alert('Please allow geolocation access');
      }
      setError(err.message);
    };

    const watchId = navigator.geolocation.watchPosition(success, handleError, options);
    
    // Clean up the watcher on component unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  },[]);

  useEffect(() => {
    if (location.connected) {
      const chatMessage = {
        latitude: location.latitude,
        longitude: location.longitude,
        userName: location.username,
        status: 'JOIN',
      };
      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
    }
  }, [location.latitude, location.longitude, location.connected]);



    const handleUsernameInput = (event) => {
    const { value } = event.target;
    
        setLocation((userData) => ({ ...userData,username: value }));
  };

  return (
    <div>
      <h1>GeoLocation Tracker</h1>
      {location.connected ? (
        <div>

          <MapContainer center={[20.5937,78.9629]} zoom={5}>
       {/* OPEN STREEN MAPS TILES */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {[...marker.keys()].map((m, i) => (
            <Marker key={m} icon={customIcon} position={marker.get(m)}>
              <Popup>{m}</Popup>
            </Marker>
        ))}
          </MapContainer>
        </div>
      ) : (
        <div className="register">
            <input
              id="user-name"
              placeholder="Enter your name"
              name="userName"
              value={location.username}
              onChange={handleUsernameInput}
              margin="normal"
            />
            <button type="button" onClick={registerUser}>
              Connect
            </button>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default App;