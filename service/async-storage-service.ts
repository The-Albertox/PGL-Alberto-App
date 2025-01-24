import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  toDoList: "to-do-list",
  userToken: "user-token",
};

async function save<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
}

async function get<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }

  return null;
}

async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(`AsyncStorage Error: ${e}`);
  }
}

export const asyncStorageService = {
  KEYS,
  save,
  get,
  remove,
};
