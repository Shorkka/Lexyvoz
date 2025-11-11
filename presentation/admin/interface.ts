// ==============================================
// src/core/admin/interfaces.ts
// Interfaces genéricas para páginas de Admin
// ==============================================
import React from 'react';
import { Ionicons } from '@expo/vector-icons';


export interface ListParams {
page?: number;
limit?: number;
search?: string;
activo?: boolean;
}


export interface Paginated<T> {
message?: string;
data: T[];
page?: number;
limit?: number;
total?: number;
}


export interface AdminListColumn<T> {
key: keyof T | string;
label: string;
width?: number;
flex?: number;
render?: (row: T) => React.ReactNode;
}


export interface AdminRowAction<T> {
icon: React.ComponentProps<typeof Ionicons>['name'];
label: string;
onPress: (row: T) => void | Promise<void>;
}


export interface AdminCrudService<T, CreateDTO = any, UpdateDTO = CreateDTO> {
list: (params?: ListParams) => Promise<Paginated<T>>;
get?: (id: number) => Promise<T>;
create?: (dto: CreateDTO) => Promise<T>;
update?: (id: number, dto: UpdateDTO) => Promise<T>;
remove?: (id: number) => Promise<{ success: boolean; message?: string } | void>;
}