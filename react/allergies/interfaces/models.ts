export interface AllergyDto {
    id: number;
    patientId: number;
    description: string;
    type: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateAllergyDto = Omit<AllergyDto, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateAllergyDto = Partial<CreateAllergyDto>;

export interface UpdateAllergyStatusDto {
    status: string;
}

export interface AllergyHistoryDto {
    id: number;
    allergyId: number;
    previousStatus: string;
    newStatus: string;
    changedBy: string;
    changedAt: string;
}
