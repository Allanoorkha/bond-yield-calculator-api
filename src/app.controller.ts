import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): string {
        return 'Bond Yield Calculator API is running!';
    }

    @Get('ping')
    ping(): string {
        return 'pong';
    }
}
