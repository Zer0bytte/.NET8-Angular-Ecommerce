export interface User {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;

}


export interface Address {
    firstName:string;
    lastName:string;
    street:string;
    city:string;
    state:string;
    zipCode:string;
}