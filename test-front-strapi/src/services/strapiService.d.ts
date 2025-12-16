// Type declarations for strapiService.js
// This file provides TypeScript type information for the JavaScript strapiService module

export interface StrapiUser {
    id: number;
    username: string;
    email: string;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface StrapiAuthResponse {
    jwt: string;
    user: StrapiUser;
}

export interface StrapiUploadFile {
    id: number;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    createdAt: string;
    updatedAt: string;
}

export interface UploadOptions {
    ref?: string;
    refId?: string | number;
    field?: string;
}

// Authentication functions
export function register(userData: { username: string; email: string; password: string }): Promise<StrapiAuthResponse>;
export function login(credentials: { identifier: string; password: string }): Promise<StrapiAuthResponse>;
export function logout(): void;
export function getCurrentUser(): StrapiUser | null;
export function isAuthenticated(): boolean;

// CRUD operations
export function getAll(collection: string, params?: any): Promise<any>;
export function getById(collection: string, id: number | string, params?: any): Promise<any>;
export function create(collection: string, data: any): Promise<any>;
export function update(collection: string, id: number | string, data: any): Promise<any>;
export function remove(collection: string, id: number | string): Promise<any>;

// File management
export function uploadFile(file: File, options?: UploadOptions): Promise<StrapiUploadFile[]>;
export function getFiles(params?: any): Promise<StrapiUploadFile[]>;
export function deleteFile(id: number | string): Promise<StrapiUploadFile>;

// Profile management
export function getProfile(userId: number | string): Promise<any>;
export function createProfile(userId: number | string, profileData: any): Promise<any>;
export function updateProfile(profileId: number | string, profileData: any): Promise<any>;
export function uploadAvatar(file: File, profileId: number | string): Promise<StrapiUploadFile[]>;

// Utilities
export function getStrapiURL(url: string): string;
export function extractStrapiData(response: any): any;

// Default export
declare const strapiService: {
    register: typeof register;
    login: typeof login;
    logout: typeof logout;
    getCurrentUser: typeof getCurrentUser;
    isAuthenticated: typeof isAuthenticated;
    getAll: typeof getAll;
    getById: typeof getById;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
    uploadFile: typeof uploadFile;
    getFiles: typeof getFiles;
    deleteFile: typeof deleteFile;
    getProfile: typeof getProfile;
    createProfile: typeof createProfile;
    updateProfile: typeof updateProfile;
    uploadAvatar: typeof uploadAvatar;
    getStrapiURL: typeof getStrapiURL;
    extractStrapiData: typeof extractStrapiData;
};

export default strapiService;
