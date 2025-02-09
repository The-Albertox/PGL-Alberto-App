export const apiService = {
  async fetchImages(token: string) {
    try {
      const response = await fetch(
        "http://192.168.116.174:8082/images/get-all",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching images:", errorData);
        throw new Error("Error fetching images");
      }
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  async saveImage(
    token: string,
    base64Image: string,
    width: number,
    height: number
  ) {
    try {
      const response = await fetch("http://192.168.116.174:8082/images/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ encodedData: base64Image, width, height }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving image:", errorData);
        throw new Error("Error saving image");
      }
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },

  async deleteImage(token: string, imageId: number) {
    try {
      const response = await fetch(
        `http://192.168.116.174:8082/images/${imageId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting image:", errorData);
        throw new Error("Error deleting image");
      }
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },
};
