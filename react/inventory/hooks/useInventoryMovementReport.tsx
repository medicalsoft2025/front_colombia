// hooks/useInventoryMovementReport.ts
import { useState, useEffect } from "react";
import { inventoryService } from "../../../services/api";

interface Movement {
    movement_id: number;
    type: string;
    quantity: number;
    movement_date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    lot: any;
    invoice: any;
    user: any;
    source_deposit: any;
    destination_deposit: any;
    related_deposit: any;
}

interface DepositReport {
    deposit_id: number;
    deposit_name: string;
    deposit_type: string;
    is_active: boolean;
    total_movements: number;
    movements: Movement[];
}

export const useInventoryMovementReport = () => {
    const [reportData, setReportData] = useState<DepositReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

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
        refreshReport: fetchReportData,
    };
};
