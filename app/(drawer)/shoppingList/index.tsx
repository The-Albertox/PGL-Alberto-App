import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";

type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: string;
  precio: string;
  enCarrito: boolean;
};

export default function ListaDeCompras() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaModalVisible, setCategoriaModalVisible] = useState(false);
  const [edicionProducto, setEdicionProducto] = useState<Producto | null>(null);
  const [nuevoProducto, setNuevoProducto] = useState<Partial<Producto>>({
    nombre: "",
    categoria: "",
    cantidad: "",
    precio: "",
  });

  const categoriasDisponibles = [
    "Panadería",
    "Bebidas",
    "Enlatados",
    "Carnes",
    "Pescados",
    "Frutas/Verduras",
    "Otros",
  ];

  const categoriasImagen: Record<string, any> = {
    Panadería: require("../../../assets/img/panaderia.png"),
    Bebidas: require("../../../assets/img/bebidas.png"),
    Enlatados: require("../../../assets/img/enlatados.png"),
    Carnes: require("../../../assets/img/carnes.png"),
    Pescados: require("../../../assets/img/pescados.png"),
    "Frutas/Verduras": require("../../../assets/img/frutas_verduras.png"),
    Otros: require("../../../assets/img/otrosxd.png"),
  };

  const agregarProducto = () => {
    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.categoria ||
      !nuevoProducto.cantidad ||
      !nuevoProducto.precio
    ) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    const producto: Producto = edicionProducto
      ? (Object.assign({}, nuevoProducto, {
          id: edicionProducto.id,
          enCarrito: edicionProducto.enCarrito,
        }) as Producto)
      : (Object.assign({}, nuevoProducto, {
          id: uuid.v4().toString(),
          enCarrito: false,
        }) as Producto);

    const actualizados = edicionProducto
      ? productos.map((p) => (p.id === edicionProducto.id ? producto : p))
      : [...productos, producto];

    setProductos(actualizados);

    const nuevoTotal = actualizados.reduce((sum, item) => {
      if (item.enCarrito) {
        return sum + parseFloat(item.precio) * parseInt(item.cantidad, 10);
      }
      return sum;
    }, 0);
    setTotalPrecio(nuevoTotal);

    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNuevoProducto({ nombre: "", categoria: "", cantidad: "", precio: "" });
    setEdicionProducto(null);
    setModalVisible(false);
  };

  const eliminarProducto = (id: string) => {
    const actualizados = productos.filter((item) => item.id !== id);
    setProductos(actualizados);

    const nuevoTotal = actualizados.reduce((sum, item) => {
      if (item.enCarrito) {
        return sum + parseFloat(item.precio) * parseInt(item.cantidad, 10);
      }
      return sum;
    }, 0);
    setTotalPrecio(nuevoTotal);
  };

  const marcarComoObtenido = (id: string) => {
    const actualizados = productos.map((item) =>
      item.id === id ? { ...item, enCarrito: !item.enCarrito } : item
    );
    setProductos(actualizados);

    const nuevoTotal = actualizados.reduce((sum, item) => {
      if (item.enCarrito) {
        return sum + parseFloat(item.precio) * parseInt(item.cantidad, 10);
      }
      return sum;
    }, 0);
    setTotalPrecio(nuevoTotal);
  };

  const editarProducto = (producto: Producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      categoria: producto.categoria,
      cantidad: producto.cantidad,
      precio: producto.precio,
    });
    setEdicionProducto(producto);
    setModalVisible(true);
  };

  const eliminarTodos = () => {
    setProductos([]);
    setTotalPrecio(0);
  };

  const seleccionarCategoria = () => {
    setModalVisible(false);
    setCategoriaModalVisible(true);
  };

  const renderCategoriaModal = () => (
    <Modal visible={categoriaModalVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.header}>Seleccionar Categoría</Text>
        {categoriasDisponibles.map((categoria, index) => (
          <Pressable
            key={index}
            style={styles.categoryItem}
            onPress={() => {
              setNuevoProducto({ ...nuevoProducto, categoria });
              setCategoriaModalVisible(false);
              setModalVisible(true);
            }}
          >
            <Text style={styles.categoryText}>{categoria}</Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.cancelButton}
          onPress={() => setCategoriaModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Compras</Text>
      <Text style={styles.total}>Total: {totalPrecio.toFixed(2)} €</Text>

      {productos.length === 0 ? (
        <Text style={styles.emptyMessage}>La lista está vacía</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image
                source={categoriasImagen[item.categoria]}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={item.enCarrito ? styles.textCrossedOut : null}>
                  {item.nombre}
                </Text>
                <Text style={item.enCarrito ? styles.textCrossedOut : null}>
                  {item.cantidad} x {parseFloat(item.precio).toFixed(2)} €
                </Text>
              </View>
              <Pressable onPress={() => marcarComoObtenido(item.id)}>
                <Text style={item.enCarrito ? styles.obtein : styles.pending}>
                  {item.enCarrito ? "✓" : "Pendiente"}
                </Text>
              </Pressable>
              <Pressable onPress={() => editarProducto(item)}>
                <Text style={styles.edit}>✎</Text>
              </Pressable>
              <Pressable onPress={() => eliminarProducto(item.id)}>
                <Text style={styles.delete}>X</Text>
              </Pressable>
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.clearButton}
          onPress={eliminarTodos}
          disabled={productos.length === 0}
        >
          <Text
            style={
              productos.length === 0 ? styles.clearDisabled : styles.clearText
            }
          >
            Borrar Todo
          </Text>
        </Pressable>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Nombre del producto"
            style={styles.input}
            value={nuevoProducto.nombre}
            onChangeText={(text) =>
              setNuevoProducto({ ...nuevoProducto, nombre: text })
            }
          />
          <TouchableOpacity
            style={styles.dropdown}
            onPress={seleccionarCategoria}
          >
            <Text style={styles.dropdownText}>
              {nuevoProducto.categoria || "Seleccionar categoría"}
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Cantidad"
            style={styles.input}
            keyboardType="numeric"
            value={nuevoProducto.cantidad?.toString()}
            onChangeText={(text) =>
              setNuevoProducto({ ...nuevoProducto, cantidad: text })
            }
          />
          <TextInput
            placeholder="Precio por unidad"
            style={styles.input}
            keyboardType="decimal-pad"
            value={nuevoProducto.precio?.toString()}
            onChangeText={(text) =>
              setNuevoProducto({ ...nuevoProducto, precio: text })
            }
          />
          <Pressable style={styles.saveButton} onPress={agregarProducto}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={limpiarFormulario}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>

      {renderCategoriaModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  obtein: {
    color: "green",
    fontWeight: "bold",
    marginRight: 10,
  },
  pending: {
    color: "orange",
    fontWeight: "bold",
    marginRight: 10,
  },
  delete: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownText: {
    color: "#444",
  },
  categoryItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  categoryText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  clearText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearDisabled: {
    color: "#bbb",
    fontSize: 16,
    fontWeight: "bold",
  },
  edit: {
    color: "#007BFF",
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 10,
  },
  textCrossedOut: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
});
