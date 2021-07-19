import { MyContext } from "src/types";
import { MiddlewareFn, UseMiddleware } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
	//@ts-ignore
	if (!context.req.session.userId) {
		throw new Error("not authenticated")
	}

	return next();

}