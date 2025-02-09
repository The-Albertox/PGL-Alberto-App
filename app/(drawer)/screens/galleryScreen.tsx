import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  Pressable,
  Modal,
  Button,
  Alert,
  StyleSheet,
  Text,
  Animated,
  Easing,
} from "react-native";
import { apiService } from "../../../service/apiService";
import { asyncStorageService } from "../../../service/async-storage-service";
import LoadingSpinner from "../../../components/loadingSpinner";
import { CameraView, useCameraPermissions } from "expo-camera";

interface ImageData {
  id: number;
  encodedData: string;
  width: number;
  height: number;
}

const GalleryScreen = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const loadImages = async () => {
      const token = await asyncStorageService.get<string>(
        asyncStorageService.KEYS.userToken
      );
      if (token) {
        try {
          const data = await apiService.fetchImages(token);
          setImages(data);
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar las imágenes");
        }
      }
      setLoading(false);
    };
    loadImages();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) {
      Alert.alert("Error", "Cámara no está lista");
      return;
    }
    if (!permission?.granted) {
      Alert.alert(
        "Permiso requerido",
        "Debes conceder acceso a la cámara para tomar fotos."
      );
      return;
    }

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
        const base64WithPrefix = `data:image/jpeg;base64,${photo.base64}`;
        const savedImage = await apiService.saveImage(
          token,
          base64WithPrefix,
          photo.width,
          photo.height
        );
        if (savedImage) {
          setImages((prevImages) => [...prevImages, savedImage]);
        }
      }
    } catch (error: any) {
      console.error("Error al tomar la foto:", error);
      Alert.alert("Error", error.message || "No se pudo tomar la foto");
    } finally {
      setCameraLoading(false);
      setCameraVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay imágenes guardadas.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedImage(item.encodedData)}
              onLongPress={() => console.log("Eliminar imagen:", item.id)}
            >
              <Image
                source={{ uri: `data:image/png;base64,${item.encodedData}` }}
                style={styles.image}
              />
            </Pressable>
          )}
          numColumns={3}
        />
      )}

      <Button title="Abrir Cámara" onPress={() => setCameraVisible(true)} />

      <Modal visible={cameraVisible} animationType="slide">
        {cameraLoading ? (
          <LoadingSpinner />
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} facing="back">
            <View style={styles.cameraButtons}>
              <Button title="Tomar Foto" onPress={takePicture} />
              <Button title="Cerrar" onPress={() => setCameraVisible(false)} />
            </View>
          </CameraView>
        )}
      </Modal>

      <Modal visible={!!selectedImage} transparent={true}>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setSelectedImage(null)}
        >
          <Image
            source={{ uri: `data:image/png;base64,${selectedImage}` }}
            style={styles.fullImage}
          />
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  camera: {
    flex: 1,
  },
  cameraButtons: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: 300,
    height: 300,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default GalleryScreen;
