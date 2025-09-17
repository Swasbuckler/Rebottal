import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class RecaptchaAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-recaptcha-token'];
    if (!token) {
      throw new BadRequestException('Recaptcha Token must be included');
    }

    return await this.authService.validateRecaptcha(token);
  }
}