export const calculateTotal = (
  products: any = [],
  facturacionEntidad: boolean,
): number => {
  const priceField = facturacionEntidad ? "copayment" : "price";
  const productsArray = Array.isArray(products)
    ? products
    : Object.values(products || {});
  return productsArray.reduce((sum, product) => {
    const price = Number(product?.[priceField]) || 0;
    const quantity = Number(product?.quantity) || 0;
    const tax = Number(product?.tax) || 0;
    return sum + price * quantity * (1 + tax / 100);
  }, 0);
};

export const calculateCopayment = (
  products: any = [],
  copaymentRules: any,
  facturacionEntidad: boolean,
) => {
  let copayment: any = 0;
  let isCopaymentVar: any = false;
  const productsArray = Array.isArray(products)
    ? products
    : Object.values(products || {});

  if (copaymentRules?.message) {
    return {
      copayment: 0,
      isCopayment: isCopaymentVar,
    };
  }

  if (!facturacionEntidad) {
    if (
      !copaymentRules.level &&
      copaymentRules.value_type === "percentage" &&
      copaymentRules.affiliate_type === "2"
    ) {
      const percentage: any = Number(copaymentRules.value).toFixed(2) || 0;
      copayment = productsArray.reduce((sum, product) => {
        return sum + product.total * (percentage / 100);
      }, 0);
      return {
        copayment: copayment,
        isCopayment: !isCopaymentVar,
      };
    } else if (!copaymentRules.level && copaymentRules.value_type === "fixed") {
      copayment = productsArray.length * Number(copaymentRules.value) || 0;
      return {
        copayment: copayment,
        isCopayment: isCopaymentVar,
      };
    } else if (
      copaymentRules.level == "2" &&
      copaymentRules.attention_type === "procedure"
    ) {
      copayment = productsArray.reduce((sum, product) => {
        return sum + product.total * (10 / 100);
      }, 0);
      return {
        copayment: copayment,
        isCopayment: !isCopaymentVar,
      };
    }
    return {
      copayment: 0,
      isCopayment: isCopaymentVar,
    };
  } else {
    if (
      !copaymentRules.level &&
      copaymentRules.value_type === "percentage" &&
      copaymentRules.affiliate_type === "2"
    ) {
      const percentage: any = Number(copaymentRules.value).toFixed(2) || 0;
      const valueByEntity = productsArray.flatMap((product) => {
        return product?.entities?.filter(
          (entity: any) => entity?.category === copaymentRules.category,
        );
      });
      copayment = valueByEntity.reduce((sum, product) => {
        return Number(sum) + Number(product.price) * (percentage / 100);
      }, 0);
      return {
        copayment: copayment,
        isCopayment: !isCopaymentVar,
      };
    } else if (!copaymentRules.level && copaymentRules.value_type === "fixed") {
      const valueByEntity = productsArray.flatMap((product) => {
        return product?.entities?.filter(
          (entity: any) => entity?.category === copaymentRules.category,
        );
      });
      copayment = valueByEntity.reduce((sum, product) => {
        return Number(sum) + Number(product.price);
      }, 0);
      return {
        copayment: copayment,
        isCopayment: isCopaymentVar,
      };
    } else if (
      copaymentRules.level == "2" &&
      copaymentRules.attention_type === "procedure"
    ) {
      const valueByEntity = productsArray.flatMap((product) => {
        return product?.entities?.filter(
          (entity: any) => entity?.category === copaymentRules.category,
        );
      });
      copayment = valueByEntity.reduce((sum, product) => {
        return Number(sum) + Number(product.price) * (10 / 100);
      }, 0);
      return {
        copayment: copayment,
        isCopayment: !isCopaymentVar,
      };
    }
    return {
      copayment: 0,
      isCopayment: isCopaymentVar,
    };
  }
};

export const calculatePaid = (payments: any = []): number => {
  const paymentsArray = Array.isArray(payments)
    ? payments
    : Object.values(payments);
  return paymentsArray.reduce((sum, payment) => {
    const amount = Number(payment?.amount) || 0;
    return sum + amount;
  }, 0);
};

export const calculateChange = (total: number, paid: number): number => {
  return Math.max(0, paid - total);
};

export const validatePatientStep = (patientData: any, toast: any): boolean => {
  if (!patientData.facturacionEntidad && !patientData.facturacionConsumidor) {
    toast.current?.show({
      severity: "error",
      summary: "Facturación incompleta",
      detail: "Debe seleccionar una opción de facturación",
      life: 3000,
    });
    return false;
  }

  if (patientData.facturacionEntidad) {
    const requiredBillingFields = [
      "entity",
      "authorizationNumber",
      "authorizedAmount",
    ];
    const missingBillingFields = requiredBillingFields.filter((field) => {
      const value = patientData?.[field];
      return value === undefined || value === null || value === "";
    });

    if (missingBillingFields.length > 0) {
      toast.current?.show({
        severity: "error",
        summary: "Facturación incompleta",
        detail: "Debe completar todos los campos de facturación por entidad",
        life: 3000,
      });
      return false;
    }
  }

  return true;
};

export const validateProductsStep = (products: any, toast: any): boolean => {
  const productsArray = Array.isArray(products)
    ? products
    : Object.values(products || {});

  const validProducts = productsArray.filter(
    (p) => p !== null && p !== undefined,
  );

  if (validProducts.length === 0) {
    toast.current?.show({
      severity: "error",
      summary: "Productos requeridos",
      detail: "Debe agregar al menos un producto válido",
      life: 3000,
    });
    return false;
  }

  const invalidProducts = validProducts.filter((product) => {
    return (
      !product?.description ||
      product?.price == null ||
      product?.quantity == null
    );
  });

  if (invalidProducts.length > 0) {
    toast.current?.show({
      severity: "error",
      summary: "Productos incompletos",
      detail: `Hay ${invalidProducts.length} productos sin descripción, precio o cantidad`,
      life: 3000,
    });
    return false;
  }

  return true;
};

export const validatePaymentStep = (
  payments: any[],
  total: number,
  toast: any,
): boolean => {
  if (payments.length === 0 && total > 0) {
    toast.current?.show({
      severity: "error",
      summary: "Pagos requeridos",
      detail: "Debe agregar al menos un método de pago",
      life: 3000,
    });
    return false;
  }

  const paid = calculatePaid(payments);
  if (paid < total) {
    toast.current?.show({
      severity: "error",
      summary: "Pago insuficiente",
      detail: "El monto pagado debe ser igual o mayor al total",
      life: 3000,
    });
    return false;
  }

  const invalidPayments = payments.filter((payment) => {
    return !payment.method || !payment.amount;
  });

  if (invalidPayments.length > 0) {
    toast.current?.show({
      severity: "error",
      summary: "Pagos incompletos",
      detail: "Todos los pagos deben tener método y monto",
      life: 3000,
    });
    return false;
  }

  return true;
};
