import React, { useCallback, useState } from 'react';
import { LocalStorageContext } from "../context/LocalStorageContext.js";
import { useLocalItems } from "../hooks/useLocalItems.js";
import { useLocalCreate } from "../hooks/useLocalCreate.js";
import { useLocalUpdate } from "../hooks/useLocalUpdate.js";
import { useLocalRemove } from "../hooks/useLocalRemove.js";
import { useLocalItem } from "../hooks/useLocalItem.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const LocalStorageProvider = props => {
  const {
    children,
    localStorageKey
  } = props;
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    items,
    getItems,
    loading: loadingItems
  } = useLocalItems(localStorageKey);
  const {
    item: selectedItem,
    getItem,
    setItem,
    loading: loadingItem
  } = useLocalItem(localStorageKey);
  const {
    create
  } = useLocalCreate(localStorageKey);
  const {
    update
  } = useLocalUpdate(localStorageKey);
  const {
    remove
  } = useLocalRemove(localStorageKey);
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const saveItem = useCallback(data => {
    try {
      if (!selectedItem) {
        create(data);
      } else {
        update(selectedItem.id, data);
      }
      getItems();
      showSuccessToast({
        title: 'Éxito',
        message: 'Item guardado exitosamente'
      });
    } catch (error) {
      showServerErrorsToast(error);
    }
  }, [selectedItem]);
  const removeItem = useCallback(id => {
    try {
      remove(id);
      getItems();
      showSuccessToast({
        title: 'Éxito',
        message: 'Item eliminado exitosamente'
      });
    } catch (error) {
      showServerErrorsToast(error);
    }
  }, []);
  const openDialogCreate = useCallback(() => {
    setDialogVisible(true);
    setItem(null);
  }, []);
  const openDialogEdit = useCallback(item => {
    getItem(item.id);
    setDialogVisible(true);
  }, []);
  const closeDialog = useCallback(() => {
    setDialogVisible(false);
    setItem(null);
  }, []);
  const contextValue = {
    selectedItem,
    dialogVisible,
    items,
    loadingItems,
    loadingItem,
    toast,
    saveItem,
    removeItem,
    getItems,
    openDialogCreate,
    openDialogEdit,
    closeDialog
  };
  return /*#__PURE__*/React.createElement(LocalStorageContext.Provider, {
    value: contextValue
  }, children);
};