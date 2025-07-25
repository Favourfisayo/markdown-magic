import { toast } from "react-hot-toast";
export function handleError(error: unknown, context?: string) {
  const devMode = import.meta.env.DEV; 
  let message = "An unexpected error occurred.";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    message = (error as any).message;
  }

  if (devMode) {
    console.error(`[Error]${context ? " [" + context + "]" : ""}:`, error);
  }

  toast.error(context ? `${context} failed: ${message}` : message);
  throw new Error(message);
}
