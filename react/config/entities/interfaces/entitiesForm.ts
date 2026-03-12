import { EntitiesDTO } from "./entitiesDTO";


export interface EntitiesFormInputs {
    name: string;
    entity_code: string;
    document_type: string;
    document_number: string;
    dv?: string;
    email: string;
    address: string;
    phone: string;
    country_id: string;
    department_id: string;
    city_id: string;
    tax_charge_id: string | null;
    withholding_tax_id: string | null;
    koneksi_sponsor_slug?: string | null;
    type_organization_id: any;
    type_liability_id: any;
    type_regime_id: any;
    operation_type_id: any;
    coverage_type_id: any;
    payment_method_id: any;
    document_type_id: any;
    user_type_id: any;
    contract_number: any;
    poliza_number: any;
    isEditing: boolean;
}

export interface EntitiesFormProps {
    formId: string;
    onSubmit: (data: EntitiesFormInputs) => void;
    initialData?: EntitiesDTO;
    onCancel?: () => void;
    loading?: boolean;
}