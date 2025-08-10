type ToastState = {
  msg: string | null;
  backgroundColor?: string | null;
  color?: string | null;
};

let toastSetter: React.Dispatch<React.SetStateAction<ToastState>> | null = null;
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

export function setToastSetter(
  setter: React.Dispatch<React.SetStateAction<ToastState>>
) {
  toastSetter = setter;
}

export function triggerToast(toast: ToastState, duration: number = 2000) {
  if (!toastSetter) {
    console.warn("Toast setter not initialized");
    return;
  }

  toastSetter({
        msg: null,
        backgroundColor: null,
        color: null,
      });

  // Clear any existing timeout
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  // Show the toast
  toastSetter(toast);

  // Set timeout to clear the toast
  toastTimeout = setTimeout(() => {
    if (toastSetter) {
      toastSetter({
        msg: null,
        backgroundColor: null,
        color: null,
      });
    }
    toastTimeout = null;
  }, duration);
}
