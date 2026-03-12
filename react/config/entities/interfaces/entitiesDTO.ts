export interface EntitiesDTO {
    id: number;
    name: string;
    entity_code: string;
    document_type: string;
    document_number: string;
    email: string;
    address: string;
    phone: string;
    city_id: string;
    country_id: string;
    department_id: string;
    tax_charge_id?: string | null;
    withholding_tax_id?: string | null;
    koneksi_sponsor_slug?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    type_organization_id?: any;
    type_regime_id?: any;
    type_liability_id?: any;
    dv?: string;
    operation_type_id?: any;
    coverage_type_id?: any;
    payment_method_id?: any;
    document_type_id?: any;
    user_type_id?: any;
    contract_number?: any;
    poliza_number?: any;
    isEditing?: boolean;
}


export interface UpdateEntitiesDTO {
    name: string;
    entity_code: string;
    document_type: string;
    document_number: string;
    email: string;
    address: string;
    phone: string;
    city_id: string;
    country_id: string;
    department_id: string;
    tax_charge_id?: string | null;
    withholding_tax_id?: string | null;
    koneksi_sponsor_slug?: string | null;
}

export interface CreateEntitiesDTO {
    name?: string;
    entity_code: string;
    document_type?: string;
    document_number?: string;
    dv?: string;
    email?: string;
    address?: string;
    phone?: string;
    city_id?: string;
    country_id: string;
    department_id: string;
    tax_charge_id?: string | null;
    withholding_tax_id?: string | null;
    koneksi_sponsor_slug?: string | null;
    type_organization_id?: any;
    type_regime_id?: any;
    type_liability_id?: any;
    country_code?: any;
    operation_type_id?: any;
    coverage_type_id?: any;
    payment_method_id?: any;
    document_type_id?: any;
    user_type_id?: any;
    contract_number?: any;
    poliza_number?: any;

}

