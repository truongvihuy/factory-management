import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

export interface ModuleOptions {
  isGlobal?: boolean;
}

export type ModuleInject = InjectionToken | OptionalFactoryDependency;
