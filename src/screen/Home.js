import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import GoogleForm from "./GooglrForm";
import GlobalContext from "../../context/GlobalContext";
import { useMyContext } from "../../context/GlobalContextProvider";
import axios from "axios";


export default function Home() {
  const { isSubmited, record, setRecord,ans ,setIsSubmited} = useMyContext();
// const [record, setRecord] = useState(null);


  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
 
  const [type, setType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  useEffect(() => {
   
    (async () => {
      setIsSubmited(false)
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  
    
    
  }, []);

  const isSubmitedListener = async () => {
    if (isSubmited) {
     await stopVideo(); // Stop the video (replace with your real logic)

      const formData = new FormData();
      formData.append("data", ans);

      if (record) {
        formData.append("image", {
          uri: record,
          type: "video/mp4",
          name: "video.mp4",
        });
      }

      try {
        const response = await axios.post(
          "http://15.206.166.191/upload", // Replace with your API endpoint
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle the API response
        console.log("API Response:", response.data);
      } catch (error) {
        // Handle API error
        console.error("API Error:", error);
      }
    }
  };

useEffect(()=>{
  if(!isSubmited){
      console.log("video recording...");
      takeVideo();
}else{
 
  isSubmitedListener()
}
  
},[isSubmited])
console.log(isSubmited,'isSubmited');
  const takeVideo = async () => {
    if (camera) {
      const data = await camera.recordAsync({
        // maxDuration: 10,
      });
      setRecord(data.uri);
      console.log(data.uri);
    }
  };

  const stopVideo = async () => {
    if (camera) {
     try {
      camera.stopRecordingAsync().then(async (data) => {
        // 'data.uri' contains the URI of the recorded video
        setRecord(data.uri);

        // Save the recorded video to the device's media library
        const asset = await MediaLibrary.createAssetAsync(data.uri);

        // Now 'asset' contains information about the saved video in the media library

        console.log("Video saved to media library:", asset);
      });
     } catch (error) {
      console.log(error,"Error");
     }
    }
  };
  

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      {record != null ? (
        <>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: record,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          <View style={{ rowGap: 10 }}>
            <Button
              title={status.isPlaying ? "Pause" : "Play"}
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
            />
            <Button title={"Delete"} onPress={() => setRecord(null)} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.fixedRatio}
              type={type}
              ratio={"16:9"}
            />
          </View>

          <View style={styles.buttons}>
            {false && (
              <>
                <Button
                  title="Flip Video"
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                ></Button>
                <Button title="Take video" onPress={() => takeVideo()} />
                <Button title="Stop Video" onPress={() => stopVideo()} />
              </>
            )}
          </View>
        </>
      )} 

      <View style={{ flex: 0.5 }}>
        {/* <WebView
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
      }}
      source={{ uri: 'https://github.com/jasim0021' }}
    /> */}
        <GoogleForm/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 0.5,
    flexDirection: "row",
    marginBottom: 100,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  video: {
    flex: 0.5,
    margin: 30,
    marginTop: 100,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
