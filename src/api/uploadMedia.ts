import axios from "axios";
import { API_BASE_URL } from '../constants/urls';

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}upload-media/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};