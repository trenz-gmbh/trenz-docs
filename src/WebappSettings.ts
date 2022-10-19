export interface WebappSettings {
    name: string;
    theme: {
        primary: string;
        'primary-foreground': string;
    }
    api: {
        baseUrl: string;
    }
    useAuth: boolean;
}
