import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, Image, Pressable, Modal, Button } from "react-native";
import { apiService } from "../../service/apiService";
import { asyncStorageService } from "../../service/async-storage-service";
import LoadingSpinner from "../../components/loadingSpinner";
import { Camera, CameraType } from "expo-camera";

const GalleryScreen = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      const token = await asyncStorageService.get<string>(
        asyncStorageService.KEYS.userToken
      );
      if (token) {
        const data = await apiService.fetchImages(token);
        setImages(data);
      }
      setLoading(false);
    };
    loadImages();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      setCameraLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });
        const token = await asyncStorageService.get<string>(
          asyncStorageService.KEYS.userToken
        );
        if (token) {
          const savedImage = await apiService.saveImage(
            token,
            photo.base64,
            photo.width,
            photo.height
          );
          if (savedImage) {
            setImages((prevImages) => [...prevImages, savedImage]);
          }
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo tomar la foto");
      }
      setCameraLoading(false);
      setCameraVisible(false);
    }
  };

  if (!permission) {
    return (
      <Button title="Permitir acceso a la cámara" onPress={requestPermission} />
    );
  }

  return (
    <View>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedImage(item.encodedData)}>
              <Image
                source={{ uri: `data:image/png;base64,${item.encodedData}` }}
                style={{ width: 100, height: 100 }}
              />
            </Pressable>
          )}
        />
      )}
      <Button title="Abrir Cámara" onPress={() => setCameraVisible(true)} />
      <Modal visible={cameraVisible}>
        {cameraLoading ? (
          <LoadingSpinner />
        ) : (
          <Camera ref={cameraRef} style={{ flex: 1 }} type={CameraType.back}>
            <Button title="Tomar Foto" onPress={takePicture} />
            <Button title="Cerrar" onPress={() => setCameraVisible(false)} />
          </Camera>
        )}
      </Modal>
      <Modal visible={!!selectedImage} transparent={true}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedImage(null)}
        >
          {selectedImage && (
            <Image
              source={{ uri: `data:image/png;base64,${selectedImage}` }}
              style={{ width: 300, height: 300 }}
            />
          )}
        </Pressable>
      </Modal>
    </View>
  );
};

export default GalleryScreen;
