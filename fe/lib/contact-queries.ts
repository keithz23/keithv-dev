import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "./contact-api";
export function useSendContactMessage(){return useMutation({mutationFn:sendContactMessage});}
