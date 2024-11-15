import { Close } from "@mui/icons-material";
import {
  ModalProps,
  Modal,
  Box,
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import {bgColors} from "../../constants";


export interface BaseModalProps
  extends Omit<ModalProps, "onClose" | "onSubmit" | "title"> {
  disabled?: boolean;
  onClose?: (
    event: unknown,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  title?: ReactNode;
}

export const BaseModal = ({
  title,
  children,
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  disabled,
  onClose,
  sx,
  ...rest
}: BaseModalProps) => {

  const [onSubmitHandler, setOnSubmitHandler] = useState(() => onSubmit);
  const [onCancelHandler, setOnCancelHandler] = useState(() => onCancel);
  const [onCloseHandler, setOnCloseHandler] = useState(() => onClose);
  const [isDisabled, setIsDisabled] = useState(disabled);

  const handleOnSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    onSubmitHandler?.();
  };

  const handleOnCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    onCancelHandler?.();
  };

  const handleOnClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    onCloseHandler?.(e);
  };

  const providerValue = useMemo(
    () => ({
      setSubmit: setOnSubmitHandler,
      setCancel: setOnCancelHandler,
      setClose: setOnCloseHandler,
      setIsDisabled: setIsDisabled,
    }),
    [],
  );

  useEffect(() => {
    setOnSubmitHandler(() => onSubmit);
  }, [onSubmit]);

  useEffect(() => {
    setOnCancelHandler(() => onCancel);
  }, [onCancel]);

  useEffect(() => {
    setOnCloseHandler(() => onClose);
  }, [onClose]);

  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  return (
    <Modal
      onClose={onCloseHandler}
      sx={{ display: "flex", alignItems: "center", ...sx }}
      {...rest}
    >
      <Stack
        gap={0}
        sx={{
          width: "min-content",
          margin: "0 auto",
          backgroundColor: (theme) => theme.palette.background.default,
          border: `1px solid ${bgColors[300]}`,
          borderRadius: 4,
          overflow: "hidden",
          outline: "unset",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{
            minHeight: 30,
            pl: 1.5,
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          {title}
          {onCloseHandler && (
            <IconButton sx={{ p: 1 }} onClick={handleOnClose}>
              <Close sx={{ width: "12px", height: "12px" }} />
            </IconButton>
          )}
        </Stack>
        <Box sx={{ maxHeight: "70vh", overflow: "auto" }}>
          <BaseModalContext.Provider value={providerValue}>
            {children}
          </BaseModalContext.Provider>
        </Box>
        {(onSubmitHandler || onCancelHandler) && (
          <Stack
            direction={"row"}
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              p: "10px 16px",
            }}
            justifyContent={"flex-end"}
          >
            {onCancelHandler && (
              <Button
                color="secondary"
                onClick={handleOnCancel}
                disabled={isDisabled}
              >
                {cancelText ?? "Отменить"}
              </Button>
            )}
            {onSubmitHandler && (
              <Button onClick={handleOnSubmit} disabled={isDisabled}>
                {submitText ?? 'Применить'}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

interface IBaseModalContext {
  setSubmit: (cb: BaseModalProps["onSubmit"]) => void;
  setCancel: (cb: BaseModalProps["onCancel"]) => void;
  setClose: (cb: BaseModalProps["onClose"]) => void;
  setIsDisabled: (isDisabled: boolean) => void;
}

export const BaseModalContext = createContext<IBaseModalContext>({
  setCancel: () => {},
  setClose: () => {},
  setIsDisabled: () => {},
  setSubmit: () => {},
});
