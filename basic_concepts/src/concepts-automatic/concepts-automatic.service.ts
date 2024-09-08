import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceptsAutomaticService {
  solveHome(): string {
    return 'Home for automatically made routes';
  }
}
