export interface FamilyMemberHistoryDto {
    id: number;
    patientId: number;
    relationshipCode: string;
    cie11: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateFamilyMemberHistoryDto = Omit<FamilyMemberHistoryDto, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateFamilyMemberHistoryDto = Partial<CreateFamilyMemberHistoryDto>;

export interface UpdateFamilyMemberHistoryStatusDto {
    status: string;
}

export interface FamilyMemberHistoryHistoryDto {
    id: number;
    familyMemberHistoryId: number;
    previousStatus: string;
    newStatus: string;
    changedBy: string;
    changedAt: string;
}
