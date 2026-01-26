export interface Menu {
    id: number
    key: string
    is_active: boolean
    created_at: string
    updated_at: string
    label: string
    icon: string
    url?: string
    parent_id?: number
    items?: Menu[]
}
