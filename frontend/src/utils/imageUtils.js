import imageCompression from "browser-image-compression";

export const compressAndResizeImage = async (file, maxWidth, maxHeight) => {
  try {
    const options = {
      maxSizeMB: 1, // Maximum file size in megabytes
      maxWidthOrHeight: Math.max(maxWidth, maxHeight), // Maximum width or height
      useWebWorker: true, // Enable web worker for faster compression (optional)
      initialQuality: 0.85,
      fileType: "image/jpeg",
    };
    console.log(file, file?.size / 1024 + " KB");

    const compressedImageBlob = await imageCompression(file, options);

    const compressedImageFile = new File(
      [compressedImageBlob],
      compressedImageBlob.name,
      {
        type: compressedImageBlob.type,
      }
    );
    console.log(compressedImageFile, compressedImageFile.size / 1024 + " KB");

    const dataUrl = await imageCompression.getDataUrlFromFile(
      compressedImageFile
    );

    // return new Promise((resolve, reject) => {
    //   if (!dataUrl) {
    //     reject(new Error("Failed to compress and resize image"));
    //     return;
    //   }

    //   resolve(dataUrl);
    // });

    return new Promise((resolve, reject) => {
      if (!compressedImageFile && !dataUrl) {
        reject(new Error("Failed to compress and resize image"));
        return;
      }

      resolve({ imageFile: compressedImageFile, imageDataUrl: dataUrl });
    });
  } catch (error) {
    // Handle any errors that occur during compression
    console.log(error);
  }
};

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export const generateCroppedImage = async (
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) => {
  if (!imageSrc || !pixelCrop) {
    return null;
  }

  // console.log("getCroppedImg params: ", imageSrc, pixelCrop, rotation, flip);
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  // return croppedCanvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to generate cropped image"));
        return;
      }

      console.log(
        "Cropped Image Blob and Blob size: ",
        blob,
        blob.size / 1024 + " KB"
      );
      console.log("Cropped Image Blob Url: ", URL.createObjectURL(blob));
      resolve(blob);
    }, "image/jpeg");
  });
};

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export function getImageDimensionsFromImageFile(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const image = new Image();

      image.onload = function () {
        const width = this.naturalWidth;
        const height = this.naturalHeight;

        console.log("Image width:", width, "Image height:", height);

        resolve({ width, height });
      };

      image.onerror = function () {
        reject(new Error("Failed to load image"));
      };

      image.src = event.target.result;
    };

    reader.onerror = function () {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(imageFile);
  });
}
