declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    news: {
        apiKey: string;
        apiUrl: string;
        sportsApiKey: string;
        sportsApiUrl: string;
    };
    upload: {
        dest: string;
        maxSize: number;
    };
    cache: {
        ttl: number;
    };
    cors: {
        origin: string;
    };
};
export default _default;
