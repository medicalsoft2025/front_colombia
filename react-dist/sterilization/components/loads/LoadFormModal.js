function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete } from 'primereact/autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { usePackages } from "../../hooks/usePackages.js";
import { useUsersForSelect } from "../../../users/hooks/useUsersForSelect.js";
import { processTypes, reasons } from "../../consts/index.js"; // Interfaz interna para el formulario
export const LoadFormModal = props => {
  const {
    visible,
    onHide,
    onSave,
    saving
  } = props;
  const {
    packages
  } = usePackages();
  const {
    users
  } = useUsersForSelect();
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [autoCompleteValue, setAutoCompleteValue] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    defaultValues: {
      processTypeId: null,
      reasonId: null,
      sterilizationDate: null,
      startTime: null,
      durationMinutes: null,
      temperature: null,
      pressure: null,
      validityDays: null,
      responsibleId: null,
      chemicalControl: false,
      biologicalControl: false,
      observations: ''
    }
  });
  const watchStartTime = watch('startTime');
  const watchDuration = watch('durationMinutes');
  const watchSterilizationDate = watch('sterilizationDate');
  const watchValidityDays = watch('validityDays');

  // Cálculos dependientes
  const calculatedEndTime = React.useMemo(() => {
    if (watchStartTime && watchDuration) {
      const end = new Date(watchStartTime.getTime());
      end.setMinutes(end.getMinutes() + watchDuration);
      return end;
    }
    return null;
  }, [watchStartTime, watchDuration]);
  const calculatedExpirationDate = React.useMemo(() => {
    if (watchSterilizationDate && watchValidityDays) {
      const exp = new Date(watchSterilizationDate.getTime());
      exp.setDate(exp.getDate() + watchValidityDays);
      return exp;
    }
    return null;
  }, [watchSterilizationDate, watchValidityDays]);
  useEffect(() => {
    if (visible) {
      reset();
      setSelectedPackages([]);
      setAutoCompleteValue(null);
    }
  }, [visible, reset]);
  const onSubmit = data => {
    if (selectedPackages.length === 0) {
      alert('Debe agregar al menos un paquete en la pestaña "Paquetes".');
      return;
    }
    // Construir el DTO
    const payload = {
      processTypeId: data.processTypeId,
      reasonId: data.reasonId,
      sterilizationDate: data.sterilizationDate.toISOString().split('T')[0],
      startTime: data.startTime,
      durationMinutes: data.durationMinutes,
      endTime: calculatedEndTime,
      temperature: data.temperature,
      pressure: data.pressure,
      validityDays: data.validityDays,
      expirationDate: calculatedExpirationDate,
      responsibleId: data.responsibleId,
      chemicalControl: data.chemicalControl,
      biologicalControl: data.biologicalControl,
      observations: data.observations,
      packages: selectedPackages
    };
    onSave(payload);
  };
  const searchPackage = event => {
    let _filteredPackages;
    if (!event.query.trim().length) {
      _filteredPackages = [...packages];
    } else {
      _filteredPackages = packages.filter(pkg => {
        return pkg.name.toLowerCase().includes(event.query.toLowerCase()) || pkg.prefix.toLowerCase().includes(event.query.toLowerCase());
      });
    }
    setFilteredPackages(_filteredPackages.filter(p => !selectedPackages.find(sp => sp.id === p.id)));
  };
  const onPackageSelect = e => {
    setSelectedPackages([...selectedPackages, e.value]);
    setAutoCompleteValue(null);
  };
  const removePackage = pkgId => {
    setSelectedPackages(selectedPackages.filter(p => p.id !== pkgId));
  };
  const dialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3 p-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    severity: "secondary",
    onClick: onHide,
    disabled: saving,
    type: "button"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar Carga",
    icon: /*#__PURE__*/React.createElement("i", {
      className: `fa fa-save me-2`
    }),
    onClick: handleSubmit(onSubmit),
    disabled: saving || !isValid || selectedPackages.length === 0,
    type: "button"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nueva Carga",
    visible: visible,
    onHide: onHide,
    style: {
      width: '70vw'
    },
    breakpoints: {
      '960px': '85vw',
      '641px': '100vw'
    },
    footer: dialogFooter
  }, /*#__PURE__*/React.createElement(TabView, null, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Informaci\xF3n"
  }, /*#__PURE__*/React.createElement("form", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de proceso ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "processTypeId",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: processTypes,
      optionLabel: "name",
      optionValue: "name",
      placeholder: "Seleccione",
      className: `w-100 ${errors.processTypeId ? 'p-invalid' : ''}`
    })
  }), errors.processTypeId && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.processTypeId.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Motivo ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "reasonId",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: reasons,
      optionLabel: "name",
      optionValue: "name",
      placeholder: "Seleccione",
      className: `w-100 ${errors.reasonId ? 'p-invalid' : ''}`
    })
  }), errors.reasonId && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.reasonId.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha esterilizaci\xF3n ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "sterilizationDate",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: `w-100 ${errors.sterilizationDate ? 'p-invalid' : ''}`
    })
  }), errors.sterilizationDate && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.sterilizationDate.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Hora inicio ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "startTime",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      timeOnly: true,
      showIcon: true,
      className: `w-100 ${errors.startTime ? 'p-invalid' : ''}`
    })
  }), errors.startTime && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.startTime.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Duraci\xF3n (min) ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "durationMinutes",
    control: control,
    rules: {
      required: 'Obligatorio',
      min: 1
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      onChange: e => field.onChange(e.value),
      className: `w-100 ${errors.durationMinutes ? 'p-invalid' : ''}`
    })
  }), errors.durationMinutes && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.durationMinutes.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Hora fin"), /*#__PURE__*/React.createElement(Calendar, {
    value: calculatedEndTime,
    timeOnly: true,
    showIcon: true,
    disabled: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Temperatura (\xB0C) ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "temperature",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      onChange: e => field.onChange(e.value),
      className: `w-100 ${errors.temperature ? 'p-invalid' : ''}`
    })
  }), errors.temperature && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.temperature.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Presi\xF3n (PSI) ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "pressure",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      onChange: e => field.onChange(e.value),
      className: `w-100 ${errors.pressure ? 'p-invalid' : ''}`
    })
  }), errors.pressure && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.pressure.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Vigencia (d\xEDas) ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "validityDays",
    control: control,
    rules: {
      required: 'Obligatorio',
      min: 1
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      onChange: e => field.onChange(e.value),
      className: `w-100 ${errors.validityDays ? 'p-invalid' : ''}`
    })
  }), errors.validityDays && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.validityDays.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha vencimiento"), /*#__PURE__*/React.createElement(Calendar, {
    value: calculatedExpirationDate,
    dateFormat: "dd/mm/yy",
    showIcon: true,
    disabled: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Responsable ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "responsibleId",
    control: control,
    rules: {
      required: 'Obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: users,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      filter: true,
      className: `w-100 ${errors.responsibleId ? 'p-invalid' : ''}`
    })
  }), errors.responsibleId && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.responsibleId.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3 d-flex align-items-center mt-md-4 pt-md-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "chemicalControl",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "field-checkbox mb-0"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      inputId: field.name,
      onChange: e => field.onChange(e.checked),
      checked: field.value
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "ml-2 mb-0 ms-2"
    }, "Control qu\xEDmico"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3 d-flex align-items-center mt-md-4 pt-md-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "biologicalControl",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "field-checkbox mb-0"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      inputId: field.name,
      onChange: e => field.onChange(e.checked),
      checked: field.value
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "ml-2 mb-0 ms-2"
    }, "Control biol\xF3gico"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Observaciones"), /*#__PURE__*/React.createElement(Controller, {
    name: "observations",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name
    }, field, {
      rows: 3,
      className: "w-100"
    }))
  })))), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Paquetes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-2",
    style: {
      minHeight: '300px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Buscar y seleccionar paquetes ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(AutoComplete, {
    value: autoCompleteValue,
    suggestions: filteredPackages,
    completeMethod: searchPackage,
    field: "name",
    onChange: e => setAutoCompleteValue(e.value),
    onSelect: onPackageSelect,
    placeholder: "Escriba el nombre del paquete",
    className: "w-100 mb-3",
    inputClassName: "w-100"
  }), selectedPackages.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning text-center"
  }, "No hay paquetes seleccionados. Agregue al menos uno para guardar la carga."), selectedPackages.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "list-group"
  }, selectedPackages.map(pkg => /*#__PURE__*/React.createElement("li", {
    key: pkg.id,
    className: "list-group-item d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, pkg.prefix), " - ", pkg.name, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, pkg.content)), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash"
    }),
    className: "p-button-rounded p-button-danger p-button-text",
    onClick: () => removePackage(pkg.id),
    type: "button"
  }))))))));
};