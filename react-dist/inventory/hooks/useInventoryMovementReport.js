// hooks/useInventoryMovementReport.ts
import { useState, useEffect } from "react";
import { inventoryService } from "../../../services/api/index.js";
export const useInventoryMovementReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  useEffect(() => {
    fetchReportData();
  }, []);
  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Cambia esta URL según tu endpoint
      const response = await inventoryService.inventoryMovementReport();
      setReportData(response);
    } catch (error) {
      console.error("Error fetching inventory movement report:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    reportData,
    loading,
    dateRange,
    setDateRange,
    refreshReport: fetchReportData
  };
};