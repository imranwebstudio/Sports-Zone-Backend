import { AdSlot, AdNetwork } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateAdDto {
    name: string;
    slot: AdSlot;
    network?: AdNetwork;
    code: string;
    isActive?: boolean;
    position?: number;
    page?: string;
}
export declare class AdvertisementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }[]>;
    findActive(page?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }[]>;
    findBySlot(slot: AdSlot): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }[]>;
    create(dto: CreateAdDto): import("@prisma/client").Prisma.Prisma__AdvertisementClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: Partial<CreateAdDto>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }>;
    toggle(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        page: string | null;
        slot: import("@prisma/client").$Enums.AdSlot;
        network: import("@prisma/client").$Enums.AdNetwork;
        code: string;
        position: number;
    }>;
}
