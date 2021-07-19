import { dedupExchange, fetchExchange, gql, stringifyVariables } from "urql";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import { pipe, tap } from "wonka";
import { Exchange } from "urql";
import router from "next/router";
import { isServer } from "./isServer";
// import { stringifyVariables } from "@urql/core";
// import { Resolver } from "../types";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error?.message.includes("not authenticated")) {
            router.replace("/login");
          }
        }
      })
    );
  };

export type MergeMode = "before" | "after";

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

// yeah, idk what any of this does, something about urql pagation?
export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return { hasMore, posts: results, __typename: "PaginatedPosts" };
  };
};

export const invalidateAllPosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
              const fieldsInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              );
              fieldsInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              }); 
}

export const createUrqlClient = (srrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            //@ts-ignore
            deletePost: (_result, args, cache, info) => {
              return cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              });
            },
            //@ts-ignore
            vote: (_result, args, cache, info) => {
              const { postId, voteType } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              );
              let value: number = voteType ? 1 : -1;
              const originalValue = value;

              if (data) {
                if (data.voteStatus === value) {
                  value = 0;
                }
                // handles edge cases: new vote, undo vote, change votes
                const newPoints =
                  (data.points as number) +
                  (data.voteStatus ? 2 : 1) *
                    (value ? value : (-1 / 2) * originalValue);
                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      points
                      voteStatus
                    }
                  `,
                  {
                    id: postId,
                    points: newPoints,
                    voteStatus: value ? value : null,
                  } as any
                );
              }
            },
            //@ts-ignore
            createPost: (_result, args, cache, info) => {
              invalidateAllPosts(cache);
            },
            //@ts-ignore
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({
                  me: null,
                })
              );
            },
            //@ts-ignore
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
              invalidateAllPosts(cache);
            },
            //@ts-ignore
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      srrExchange,
      fetchExchange,
    ],
  };
};
