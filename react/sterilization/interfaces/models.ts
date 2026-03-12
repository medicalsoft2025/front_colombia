export interface PackageDto {
    id: number;
    name: string;
    prefix: string;
    content: string;
}

export interface LoadDto {
    id: number;
    processTypeId: string;
    processTypeName?: string;
    reasonId: string;
    reasonName?: string;
    sterilizationDate: string; // ISO Date String
    startTime: string | Date; // HH:mm or Date
    durationMinutes: number;
    endTime: string | Date; // HH:mm or Date
    temperature: number;
    pressure: number;
    validityDays: number;
    expirationDate: string | Date;
    responsibleId: number;
    responsibleName?: string;
    chemicalControl: boolean;
    biologicalControl: boolean;
    observations: string;
    status: string;
    packages: PackageDto[];
}

export interface LoadHistoryDto {
    id: number;
    loadId: number;
    previousStatus: string;
    newStatus: string;
    changedBy: string;
    changedAt: string;
}

export interface ProcessTypeDto {
    id: number;
    name: string;
}

export interface ReasonDto {
    id: number;
    name: string;
}

export interface ResponsibleDto {
    id: number;
    name: string;
}
