function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
export const CommentForm = ({
  taskId,
  onSave,
  isSaving = false
}) => {
  const defaultValues = {
    message: "",
    files: null
  };
  const {
    control,
    handleSubmit,
    reset,
    register
  } = useForm({
    defaultValues
  });
  const onSubmit = data => {
    onSave(data);
    reset();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-600 font-bold mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-reply mx-2 text-primary"
  }), "Agregar Comentario"), /*#__PURE__*/React.createElement("div", {
    className: "surface-100 border-round p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "message",
    control: control,
    rules: {
      required: "El comentario es obligatorio"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: `comment-message-${taskId}`
    }, field, {
      rows: 3,
      placeholder: "Escribe tu comentario aqu\xED...",
      className: `w-100 ${fieldState.invalid ? "p-invalid" : ""}`
    })), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: `comment-files-${taskId}`,
    className: "form-label text-600"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-paperclip mx-2"
  }), "Adjuntar archivos"), /*#__PURE__*/React.createElement("input", _extends({
    className: "form-control",
    type: "file",
    id: `comment-files-${taskId}`,
    multiple: true
  }, register("files")))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Enviar comentario"
    // icon={<i className="fas fa-paper-plane"></i>}
    ,
    onClick: handleSubmit(onSubmit)
    // loading={isSaving}
    ,
    disabled: isSaving
  }))));
};