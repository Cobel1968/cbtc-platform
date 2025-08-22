import jwt from 'jsonwebtoken';
/**
 * @desc Générer un token JWT de démonstration
 */
export declare const generateDemoToken: (userId: number) => any;
/**
 * @desc Middleware d'authentification
 */
export declare const authenticateToken: (req: {
    headers: {
        [x: string]: any;
    };
    query: {
        demo: string;
    };
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
        profile: {
            occupation: string;
            birthDate: string;
            expertise: string[];
        };
    } | {
        id: number;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
        profile?: undefined;
    } | undefined;
    tokenPayload: string | jwt.JwtPayload;
}, res: {
    status: (arg0: number) => {
        (): any;
        new (): any;
        json: {
            (arg0: any): any;
            new (): any;
        };
    };
}, next: () => void) => any;
/**
 * @desc Middleware pour vérifier les droits administrateur
 */
export declare const requireAdmin: (req: any, res: any, next: any) => any;
/**
 * @desc Créer des tokens de démonstration
 */
export declare const createDemoTokens: () => {
    admin: {
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
            isActive: boolean;
            profile: {
                occupation: string;
                birthDate: string;
                expertise: string[];
            };
        } | {
            id: number;
            email: string;
            name: string;
            role: string;
            isActive: boolean;
            profile?: undefined;
        } | undefined;
        token: any;
        header: string;
    };
    user: {
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
            isActive: boolean;
            profile: {
                occupation: string;
                birthDate: string;
                expertise: string[];
            };
        } | {
            id: number;
            email: string;
            name: string;
            role: string;
            isActive: boolean;
            profile?: undefined;
        } | undefined;
        token: any;
        header: string;
    };
    usage: {
        curl_admin: string;
        demo_mode: string;
    };
};
