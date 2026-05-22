const uploadImageToCloudinary = async (file) => {
  const cloudName = "dnsy3tjg0";

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "salon_uploads");
    formData.append("cloud_name", cloudName);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    console.log("Uploaded URL:", data.secure_url);
    return data.secure_url;
  } else {
    console.log("Error during upload to Cloudinary");
  }
};

export default uploadImageToCloudinary;
