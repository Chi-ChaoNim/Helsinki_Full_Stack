import { create } from "zustand";

const useNotificationStore = create((set) => {
  return {
    message: null,
    actions: {
      setMessage: (content) => {
        set(() => ({
          message: content,
        }));
        setTimeout(
          () =>
            set(() => ({
              message: null,
            })),
          5000,
        );
      },
    },
  };
});

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

export const useNotificationMessage = () =>
  useNotificationStore((state) => state.message);
