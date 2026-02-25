import { useAppSelector } from "@/application/hooks";
import { RootState } from "@/application/store";

type Selector = (state: RootState) => boolean | string;

export function usePageLoading(selector: Selector): { isLoading: boolean } {
  const value = useAppSelector(selector);
  if (typeof value === "boolean") return { isLoading: value };
  if (typeof value === "string") return { isLoading: value === "loadingPreview" };
  return { isLoading: false };
}
