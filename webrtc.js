var SrsRtcPlayer = {
    play: async function(apiUrl, videoElement, app, stream) {
        console.log("🚀 Connectant a l'API:", apiUrl);
        const pc = new RTCPeerConnection(null);
        pc.addTransceiver("audio", { direction: "recvonly" });
        pc.addTransceiver("video", { direction: "recvonly" });
        pc.ontrack = (e) => { videoElement.srcObject = e.streams[0]; };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api: apiUrl,
                sdp: offer.sdp,
                streamurl: `webrtc://94.143.142.129/${app}/${stream}`
            })
        });

        const data = await res.json();
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
    }
};
