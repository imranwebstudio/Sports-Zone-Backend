import { AdvertisementsService, CreateAdDto } from './advertisements.service';
import { AdSlot } from '@prisma/client';
export declare class AdvertisementsController {
    private readonly svc;
    constructor(svc: AdvertisementsService);
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
}
