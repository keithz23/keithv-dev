import { useQuery } from "@tanstack/react-query";
import { getPortfolioData } from "./portfolio-api";

export const portfolioKeys = {
  all: ["portfolio"] as const,
  public: () => [...portfolioKeys.all, "public"] as const,
};

export function usePortfolio() {
  return useQuery({
    queryKey: portfolioKeys.public(),
    queryFn: getPortfolioData,
  });
}
