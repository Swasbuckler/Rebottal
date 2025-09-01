import { createParamDecorator, ExecutionContext } from "@nestjs/common";

function getUserWithContext(context: ExecutionContext) {
  context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    getUserWithContext(context);
  }
);