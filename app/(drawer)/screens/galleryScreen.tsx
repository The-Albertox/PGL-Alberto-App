import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Pressable,
  Modal,
  Button,
  Alert,
} from "react-native";
import { apiService } from "../../../service/apiService";
import { asyncStorageService } from "../../../service/async-storage-service";
import LoadingSpinner from "../../../components/loadingSpinner";
import {
  Camera,
  CameraType,
  useCameraPermissions,
  CameraView,
} from "expo-camera";

interface ImageData {
  id: number;
  encodedData: string;
}

const GalleryScreen = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

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
        if (!photo || !photo.base64) {
          throw new Error("No se pudo capturar la foto");
        }
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

  const deleteImage = async (imageId: number) => {
    const token = await asyncStorageService.get<string>(
      asyncStorageService.KEYS.userToken
    );
    if (token) {
      Alert.alert(
        "Eliminar Imagen",
        "¿Estás seguro de que quieres eliminar esta imagen?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            onPress: async () => {
              const result = await apiService.deleteImage(token, imageId);
              if (result) {
                setImages((prevImages) =>
                  prevImages.filter((img) => img.id !== imageId)
                );
              }
            },
          },
        ]
      );
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedImage(item.encodedData)}
              onLongPress={() => deleteImage(item.id)}
            >
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
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
            <Button title="Tomar Foto" onPress={takePicture} />
            <Button title="Cerrar" onPress={() => setCameraVisible(false)} />
          </CameraView>
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
