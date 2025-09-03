import { createParamDecorator, ExecutionContext } from "@nestjs/common";

function getUserWithContext(context: ExecutionContext) {
  return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return getUserWithContext(context);
  }
);