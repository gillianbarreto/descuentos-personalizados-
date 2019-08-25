// Datos de Session
export class Session {
    public token?: string; // Para conexion con el Back
    public user: User;    // Datos del usuario logeado
}

// Datos del usuario
export class User {
    public idUser: string;
    public alias: string;
    public nombres: string;
    public apellidos: string
    public tipoDocumento: string;
    public numeroDocumento: string;
    public correo: string;
    public telefono: string;
    public auditDate: number;
    public codigoPromocion: string;
    public estadoUsuario: string;
    public host: string;
    public method: string;
    public methodType: string;
    public path: string;
    public userAgent: string;
    public suscripciones?: any[]; 
    public suscripcionesCodigo: string[]; 
    public sexo?: string; 
    public codigoReferido?: string;
    public idRedSocial?: string;
    public rutaFotoSmall?: string;
    public rutaFotoLarge?: string;
    public tokenRedSocial?: string;
    public fechaNacimiento?: string;
    public firebaseToken?: string;
    public deviceToken?: string; 
    public device?:string
}

export class ListView {
    text: string;
    data: any[]; 
    rubros: any[];
    filter: string;
}




