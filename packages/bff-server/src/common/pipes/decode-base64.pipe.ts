import { Injectable, PipeTransform } from '@nestjs/common';
import { decodeBase64 } from '../utils';

@Injectable()
export class DecodeBase64Pipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return decodeURIComponent(decodeBase64(value));
  }
}
