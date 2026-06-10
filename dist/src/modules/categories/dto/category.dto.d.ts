export declare class CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
    sortOrder?: number;
}
export declare class UpdateCategoryDto extends CreateCategoryDto {
    isActive?: boolean;
}
