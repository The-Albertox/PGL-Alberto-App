export const apiService = {
  async fetchImages(token: string) {
    const response = await fetch("http://192.168.116.174:8082/images/get-all", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  async saveImage(
    token: string,
    base64Image: string,
    width: number,
    height: number
  ) {
    const response = await fetch("http://192.168.116.174:8082/images/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ encodedData: base64Image, width, height }),
    });
    return response.json();
  },
};
