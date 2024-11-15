import React, { FC } from "react";
import { BaseModal, BaseModalProps } from "@/components/UI/BaseModal.tsx";
import { Stack, Typography } from "@mui/material";

interface Props extends Omit<BaseModalProps, "children"> {
  question: string;
  description?: string;
}

export const DeleteModal: FC<Props> = ({ question, description, ...rest }) => {
  return (
    <BaseModal {...rest}>
      <Stack sx={{ width: "500px", p: 2 }} gap={0}>
        <Typography>{question}</Typography>
        {description && <Typography>{description}</Typography>}
      </Stack>
    </BaseModal>
  );
};
