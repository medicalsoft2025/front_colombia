import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { CommentFormData } from "./utils/interfaces";

interface CommentFormProps {
  taskId: string;
  onSave: (data: CommentFormData) => Promise<void>;
  isSaving?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  taskId,
  onSave,
  isSaving = false,
}) => {
  const defaultValues: CommentFormData = {
    message: "",
    files: null,
  };

  const { control, handleSubmit, reset, register } = useForm<CommentFormData>({
    defaultValues,
  });

  const onSubmit = (data: CommentFormData) => {
    onSave(data);
    reset();
  };

  return (
    <div className="mt-4">
      <label className="block text-600 font-bold mb-2">
        <i className="fas fa-reply mx-2 text-primary"></i>
        Agregar Comentario
      </label>

      <div className="surface-100 border-round p-3">
        <div className="mb-3">
          <Controller
            name="message"
            control={control}
            rules={{ required: "El comentario es obligatorio" }}
            render={({ field, fieldState }) => (
              <>
                <InputTextarea
                  id={`comment-message-${taskId}`}
                  {...field}
                  rows={3}
                  placeholder="Escribe tu comentario aquí..."
                  className={`w-100 ${fieldState.invalid ? "p-invalid" : ""}`}
                />
                {fieldState.error && (
                  <small className="p-error">{fieldState.error.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="mb-3">
          <label htmlFor={`comment-files-${taskId}`} className="form-label text-600">
            <i className="fas fa-paperclip mx-2"></i>
            Adjuntar archivos
          </label>
          <input
            className="form-control"
            type="file"
            id={`comment-files-${taskId}`}
            multiple
            {...register("files")}
          />
        </div>

        <div className="flex justify-content-end">
          <Button
            label="Enviar comentario"
            // icon={<i className="fas fa-paper-plane"></i>}
            onClick={handleSubmit(onSubmit)}
            // loading={isSaving}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};