import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    // data contains any info we are passing to the decorator from the controller. (ie; "Roshan" inside the decorator @DCurrentUser("Roshan"))
    // ExecutionContext refers to the incoming request. An incoming request may be from a websocket,
    // http or graphql or anything, we are not sure about it. That's why context is of the type ExecutionContext
    const request = context.switchToHttp().getRequest(); // accessing the request object
    console.log(request.session.userId);
    return request.currentUser;
  },
);
