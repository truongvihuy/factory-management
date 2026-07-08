import { ModuleOptions } from '@libs/common';
import { HTTP_CLIENTS } from '../http-client.constants';

export interface HttpModuleOptions extends ModuleOptions {
  clients: HTTP_CLIENTS[];
}
