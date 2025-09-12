import { createParamDecorator, ExecutionContext } from "@nestjs/common";

function getSubWithContext(context: ExecutionContext) {
  return context.switchToHttp().getRequest().user.sub;
}

export const CurrentSub = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return getSubWithContext(context);
  }
);