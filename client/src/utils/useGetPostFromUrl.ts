import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

export const useGetPostFromUrl = () => {
  const router = useRouter();
  const stringId = typeof router.query.id === "string" ? router.query.id : "";
  return usePostQuery({
    skip: stringId === "",
    variables: {
      id: stringId,
    },
  });
};
