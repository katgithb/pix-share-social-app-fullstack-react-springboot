import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  ScaleFade,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import imageCompression from "browser-image-compression";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { CgEditFlipH, CgEditFlipV } from "react-icons/cg";
import { FiEye, FiEyeOff, FiRotateCcw, FiRotateCw } from "react-icons/fi";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { PiCropBold, PiMagnifyingGlassBold } from "react-icons/pi";
import {
  compressAndResizeImage,
  generateCroppedImage,
} from "../../../utils/imageUtils";
import CustomizableModal from "../../shared/CustomizableModal";

const CropUserAvatarModal = ({
  isOpen,
  onClose,
  imageFile,
  setProcessedImageSrc,
  setProcessedImageFile,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCroppedImageLoading, setIsCroppedImageLoading] = useState(false);
  const [isProcessedImageLoading, setIsProcessedImageLoading] = useState(false);
  const [showCropperOverlay, setShowCropperOverlay] = useState(true);
  const [showZoomSliderTooltip, setShowZoomSliderTooltip] = useState(false);

  const toggleCropperOverlay = () => {
    setShowCropperOverlay(!showCropperOverlay);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getDataUrlFromImageFile = async (imageFile) => {
    if (imageFile) {
      imageCompression
        .getDataUrlFromFile(imageFile)
        .then((dataUrl) => {
          const imageDataUrl = dataUrl;
          console.log("Selected Image DataUrl: ", imageDataUrl);
          setImageSrc(imageDataUrl);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const cropSelectedImage = useCallback(async () => {
    try {
      setIsCroppedImageLoading(true);
      const croppedImageBlob = await generateCroppedImage(
        imageSrc,
        croppedAreaPixels,
        rotation,
        flip
      );
      const croppedImageWithPreview = Object.assign(croppedImageBlob, {
        preview: URL.createObjectURL(croppedImageBlob),
      });
      console.log("croppedImage: ", { croppedImageWithPreview });

      setCroppedImage(croppedImageWithPreview);
      setIsCroppedImageLoading(false);
    } catch (error) {
      setIsCroppedImageLoading(false);
      console.log(error);
    }
  }, [croppedAreaPixels, flip, imageSrc, rotation]);

  const compressAndResizeSelectedImage = useCallback(async () => {
    try {
      setIsProcessedImageLoading(true);
      const processedImage = await compressAndResizeImage(
        croppedImage,
        800,
        800
      );
      console.log("Processed ImageDataUrl: ", processedImage.imageDataUrl);

      setProcessedImageSrc(processedImage.imageDataUrl);
      setProcessedImageFile(processedImage.imageFile);
      setIsProcessedImageLoading(false);
      resetCropStates();
    } catch (error) {
      setIsProcessedImageLoading(false);
      resetCropStates();
      console.log(error);
    }
  }, [croppedImage, setProcessedImageSrc, setProcessedImageFile]);

  const handleCropClick = () => {
    cropSelectedImage();
  };

  const handleResetCropClick = () => {
    setCroppedImage(null);
  };

  const handleProcessImageClick = () => {
    compressAndResizeSelectedImage();
    onClose();
  };

  const handleFlipHorizontal = () => {
    setFlip((prevFlip) => ({
      horizontal: !prevFlip.horizontal,
      vertical: prevFlip.vertical,
    }));
  };

  const handleFlipVertical = () => {
    setFlip((prevFlip) => ({
      horizontal: prevFlip.horizontal,
      vertical: !prevFlip.vertical,
    }));
  };

  const resetCropStates = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCroppedAreaPixels(null);
    setCroppedImage(null);
  };

  const handleModalClose = () => {
    setCroppedAreaPixels(null);
    setCroppedImage(null);
    onClose();
  };

  useEffect(() => {
    resetCropStates();
    getDataUrlFromImageFile(imageFile);
  }, [imageFile]);

  return (
    <CustomizableModal
      isOpen={isOpen}
      onClose={handleModalClose}
      size={"3xl"}
      showModalCloseButton={!isProcessedImageLoading}
      closeOnEsc={!isProcessedImageLoading}
      closeOnOverlayClick={!isProcessedImageLoading}
      header={<HeaderContent title="Crop Profile Photo" />}
      footer={
        <FooterContent
          croppedImage={croppedImage}
          isProcessedImageLoading={isProcessedImageLoading}
          handleProcessImageClick={handleProcessImageClick}
          handleModalClose={handleModalClose}
        />
      }
    >
      <ScaleFade in initialScale={0.9}>
        <Flex h="75vh" justify="center" my={-3} gap={2} position="relative">
          {imageSrc && !croppedImage ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 4}
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              transform={`translate(${crop.x}px, ${
                crop.y
              }px) rotate(${rotation}deg) scale(${zoom}) scaleX(${
                flip.horizontal ? -1 : 1
              }) scaleY(${flip.vertical ? -1 : 1})`}
            />
          ) : (
            <ScaleFade in={!isCroppedImageLoading} initialScale={0.9}>
              <VStack justify="center" h="full">
                <VStack position="relative" justify="center" maxH="full">
                  <Image
                    src={croppedImage?.preview}
                    alt="Cropped Image"
                    objectFit="contain"
                    rounded="lg"
                    maxW="full"
                    maxH="full"
                  />
                  <Flex position="absolute" bottom="3">
                    <IconButton
                      icon={<SmallCloseIcon />}
                      isDisabled={isProcessedImageLoading}
                      rounded="full"
                      colorScheme="red"
                      size="sm"
                      fontSize={{ base: "md", md: "md" }}
                      variant="solid"
                      boxShadow={"md"}
                      onClick={handleResetCropClick}
                    />
                  </Flex>
                </VStack>
              </VStack>
            </ScaleFade>
          )}

          {!croppedImage && (
            <HStack
              position="absolute"
              bottom="3"
              bg="gray.100"
              w={{ base: "70%", md: "50%" }}
              justify="center"
              rounded="full"
              opacity={showCropperOverlay ? 1 : 0}
              transition="opacity 0.3s ease-in-out"
              _dark={{
                bg: "gray.500",
              }}
            >
              <IconButton
                icon={<HiOutlineMinus />}
                isDisabled={isCroppedImageLoading}
                rounded="full"
                colorScheme="gray"
                boxSize={7}
                fontSize={{ base: "md", md: "md" }}
                variant="ghost"
                _dark={{
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={() =>
                  zoom <= 1 ? null : setZoom(_.round(zoom - 0.1, 1))
                }
              />

              <Slider
                value={zoom}
                isDisabled={isCroppedImageLoading}
                flex={1}
                aria-label="Zoom Image"
                defaultValue={1}
                min={1}
                max={3}
                step={0.1}
                onChange={(zoom) => setZoom(zoom)}
                onMouseEnter={() => setShowZoomSliderTooltip(true)}
                onMouseLeave={() => setShowZoomSliderTooltip(false)}
              >
                <SliderTrack bg="gray.300" h="1.5" rounded="full">
                  <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                  hasArrow
                  bg="gray.500"
                  color="white"
                  placement="top"
                  rounded="md"
                  isOpen={showZoomSliderTooltip}
                  label={`${zoom}X`}
                >
                  <SliderThumb boxSize={6}>
                    <Icon
                      as={PiMagnifyingGlassBold}
                      color={"gray.500"}
                      fontSize="md"
                      transform="rotate(90deg)"
                    />
                  </SliderThumb>
                </Tooltip>
              </Slider>

              <IconButton
                icon={<HiOutlinePlus />}
                isDisabled={isCroppedImageLoading}
                rounded="full"
                colorScheme="gray"
                boxSize={7}
                fontSize={{ base: "md", md: "md" }}
                variant="ghost"
                _dark={{
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={() =>
                  zoom >= 3 ? null : setZoom(_.round(zoom + 0.1, 1))
                }
              />
            </HStack>
          )}

          {!croppedImage && (
            <VStack
              position="absolute"
              right="3"
              py={3}
              h="full"
              justify="start"
              rounded="full"
              transition="opacity 0.3s ease-in-out"
            >
              <IconButton
                icon={showCropperOverlay ? <FiEyeOff /> : <FiEye />}
                isDisabled={isCroppedImageLoading}
                bg="gray.100"
                rounded="full"
                colorScheme="gray"
                size="sm"
                fontSize={{ base: "md", md: "md" }}
                variant="solid"
                boxShadow={"md"}
                _dark={{
                  bg: "gray.500",
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={toggleCropperOverlay}
              />
              <IconButton
                icon={<PiCropBold />}
                isLoading={isCroppedImageLoading}
                opacity={showCropperOverlay ? 1 : 0}
                bg="gray.100"
                rounded="full"
                colorScheme="gray"
                size="sm"
                fontSize={{ base: "md", md: "md" }}
                variant="solid"
                boxShadow={"md"}
                _dark={{
                  bg: "gray.500",
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={handleCropClick}
              />
              <IconButton
                icon={<FiRotateCcw />}
                isDisabled={isCroppedImageLoading}
                opacity={showCropperOverlay ? 1 : 0}
                bg="gray.100"
                rounded="full"
                colorScheme="gray"
                size="sm"
                fontSize={{ base: "md", md: "md" }}
                variant="solid"
                boxShadow={"md"}
                _dark={{
                  bg: "gray.500",
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={() =>
                  rotation <= 0 ? null : setRotation(rotation - 90)
                }
              />
              <IconButton
                icon={<FiRotateCw />}
                isDisabled={isCroppedImageLoading}
                opacity={showCropperOverlay ? 1 : 0}
                bg="gray.100"
                rounded="full"
                colorScheme="gray"
                size="sm"
                fontSize={{ base: "md", md: "md" }}
                variant="solid"
                boxShadow={"md"}
                _dark={{
                  bg: "gray.500",
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={() =>
                  rotation >= 360 ? null : setRotation(rotation + 90)
                }
              />
              <IconButton
                icon={<CgEditFlipH />}
                isDisabled={isCroppedImageLoading}
                opacity={showCropperOverlay ? 1 : 0}
                bg="gray.100"
                rounded="full"
                colorScheme="gray"
                size="sm"
                fontSize={{ base: "md", md: "md" }}
                variant="solid"
                boxShadow={"md"}
                _dark={{
                  bg: "gray.500",
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={handleFlipHorizontal}
              />
              <IconButton
                icon={<CgEditFlipV />}
                isDisabled={isCroppedImageLoading}
                opacity={showCropperOverlay ? 1 : 0}
                bg="gray.100"
                rounded="full"
                colorScheme="gray"
                size="sm"
                fontSize={{ base: "md", md: "md" }}
                variant="solid"
                boxShadow={"md"}
                _dark={{
                  bg: "gray.500",
                  _hover: { bg: "gray.600" },
                }}
                _hover={{
                  bg: "gray.200",
                }}
                onClick={handleFlipVertical}
              />
            </VStack>
          )}
        </Flex>
      </ScaleFade>
    </CustomizableModal>
  );
};

const HeaderContent = ({ title }) => {
  return (
    <Box>
      <Flex justify="start" align="center">
        <Text fontSize="md">{title}</Text>
      </Flex>
      <Box mx={-6}>
        <Divider />
      </Box>
    </Box>
  );
};

const FooterContent = ({
  croppedImage,
  isProcessedImageLoading,
  handleProcessImageClick,
  handleModalClose,
}) => {
  return (
    <Box w="full">
      <Box mx={-6} mb={2}>
        <Divider />
      </Box>

      <Stack flex={1} justify="end" spacing={4} direction={"row"} mb={-1}>
        <Button
          isDisabled={isProcessedImageLoading}
          bg={"red.400"}
          color={"white"}
          w={{ base: "full", md: "initial" }}
          _hover={{
            bg: "red.500",
          }}
          onClick={handleModalClose}
        >
          Cancel
        </Button>
        <Button
          isLoading={isProcessedImageLoading}
          loadingText="Saving..."
          isDisabled={!croppedImage}
          bg={"blue.400"}
          color={"white"}
          w={{ base: "full", md: "initial" }}
          _hover={{
            bg: "blue.500",
          }}
          onClick={handleProcessImageClick}
        >
          Save changes
        </Button>
      </Stack>
    </Box>
  );
};

export default CropUserAvatarModal;
