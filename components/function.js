export const getAllAudio = async (setAllAudio, MediaLibrary) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status === "granted") {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
    });
    // console.warn("Media", media.assets[0].duration);
    setAllAudio(media.assets);
    // console.log("all media ", media);
  }
};
