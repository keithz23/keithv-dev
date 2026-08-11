import { apiClient } from "./api-client";
export type ContactInput={name:string;email:string;message:string};
export async function sendContactMessage(input:ContactInput){return (await apiClient.post("/contact-messages",input)).data;}
