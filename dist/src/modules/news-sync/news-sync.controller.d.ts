import { NewsSyncService } from './news-sync.service';
export declare class NewsSyncController {
    private readonly svc;
    constructor(svc: NewsSyncService);
    trigger(): Promise<{
        synced: number;
        total: number;
    }>;
}
