import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();
const notificationDuration = 3600;

const toastNotification = (title, description, status) => {
  toast({
    title,
    description,
    status,
    isClosable: true,
    duration: notificationDuration,
  });
};

export const successToastNotification = (title, description) => {
  toastNotification(title, description, "success");
};

export const infoToastNotification = (title, description) => {
  toastNotification(title, description, "info");
};

export const errorToastNotification = (title, description) => {
  toastNotification(title, description, "error");
};

export const asyncToastNotification = (
  promise,
  {
    loadingTitle,
    loadingDesc,
    successTitle,
    successDesc,
    errorTitle,
    errorDesc,
  }
) => {
  toast.promise(promise, {
    loading: { title: loadingTitle || "", description: loadingDesc || "" },
    success: { title: successTitle || "", description: successDesc || "" },
    error: { title: errorTitle || "", description: errorDesc || "" },
  });
};
