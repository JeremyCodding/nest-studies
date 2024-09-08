import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceptsManualService {
  solveHome(): string {
    return 'Home for manually made routes';
  }
}
