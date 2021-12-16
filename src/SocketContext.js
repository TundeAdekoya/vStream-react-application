import React, { createContext, useState, useRef, useEffect} from 'react';
import {io} from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext();

const socket = io('http//localhost:5000');

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState( );
    const [me, setMe] = useState('')
    const [call, setCall] = useState({ })
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState(' ')

    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef();


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video:true, audio: true})
            .then ((currentStream) => {
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
            });
            socket.on('me', (id) => setMe(id));

            socket.on ('calluser', ({from, name: callerName, signal}) => {
                setCall({ isReceivingCall: true, from, name: callerName, signal})
            });
    }, []);


    //run video chat 
    const answerCall = () => {

        //recieveing call
        setCallAccepted(true)

        const peer = new Peer ({initiator: false, trickle: false, stream})

        peer.on('signal', (data) => {
            socket.emit('answercall', {signal: data, to: call.from })
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        peer.signal(call.signal)

        connectionRef.current = peer;
    };

    //calling people
    const callUser = (id) => {

        const peer = new Peer ({initiator: true, trickle: false, stream})

        peer.on('signal', (data) => {
            socket.emit('calluser', {userToCall: id, signalData: data, from: me, name})
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true)

            peer.signal(signal)
        })

        connectionRef.current = peer;
    }

    //ending call 
    const leaveCall = () => {
        setCallEnded(true)

        connectionRef.current.destroy();

        //to get new ID reload the page 
        window.location.reload()
    }
    return (
        <SocketContext.Provider value={{ callAccepted, call, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall,
        }}>
            {children}

        </SocketContext.Provider>

    );
};

export { ContextProvider, SocketContext };