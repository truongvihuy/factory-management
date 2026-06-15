// common/pipes/logging.pipe.ts

import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform {
  constructor() {
    console.log('TestPipe created');
  }
  transform(value: any) {
    console.log('TestPipe.transform');

    return value;
  }
}
