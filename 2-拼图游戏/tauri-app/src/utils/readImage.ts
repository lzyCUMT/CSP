const readImage = async (file: Blob): Promise<string> => {
  const reader = new FileReader();

  const readPromise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('read image error'));
    };
  });
  reader.readAsDataURL(file);
  try {
    const result = await readPromise;
    return result;
  } catch (error) {
    throw error;
  }
};

export { readImage };