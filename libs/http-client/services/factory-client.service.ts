import { RequestContext } from '@libs/common';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Factory, Machine, Sensor, Workshop } from '@prisma';
import { HTTP_CLIENTS } from '../http-client.constants';
import { HttpClientService } from './http-client.service';

@Injectable()
export class FactoryClient extends HttpClientService {
  constructor(
    @Inject(HTTP_CLIENTS.FACTORY)
    httpService: HttpService,
  ) {
    super(httpService);
  }

  getFactoryListAll(options?: RequestContext) {
    return this._requestServer('get', '/factory/all', null, options);
  }

  addFactory(payload: Factory, options?: RequestContext) {
    return this._requestServer('post', '/factory/create', payload, options);
  }

  updateFactory(factoryId: string, payload: Factory, options?: RequestContext) {
    return this._requestServer('put', `/factory/${factoryId}`, payload, options);
  }

  deleteFactory(factoryId: string, options?: RequestContext) {
    return this._requestServer('put', `/factory/${factoryId}`, null, options);
  }

  getWorkshopInFactory(factoryId: string, options?: RequestContext) {
    return this._requestServer('get', `/factory/${factoryId}/workshop`, null, options);
  }

  addWorkshopInFactory(factoryId: string, payload: Workshop, options?: RequestContext) {
    return this._requestServer('post', `/factory/${factoryId}/workshop`, payload, options);
  }

  updateWorkshopInFactory(factoryId: string, workshopId: string, payload: Workshop, options?: RequestContext) {
    return this._requestServer('put', `/factory/${factoryId}/workshop/${workshopId}`, payload, options);
  }

  deleteWorkshopInFactory(factoryId: string, workshopId: string, options?: RequestContext) {
    return this._requestServer('delete', `/factory/${factoryId}/workshop/${workshopId}`, null, options);
  }

  getMachineInWorkshop(factoryId: string, workshopId: string, options?: RequestContext) {
    return this._requestServer('get', `/factory/${factoryId}/workshop/${workshopId}/machine`, null, options);
  }

  async addMachine(factoryId: string, workshopId: string, payload: Machine, options?: RequestContext) {
    return this._requestServer('post', `/factory/${factoryId}/workshop/${workshopId}/machine`, payload, options);
  }

  async updateMachine(
    factoryId: string,
    workshopId: string,
    machineId: string,
    payload: Machine,
    options?: RequestContext,
  ) {
    return this._requestServer(
      'put',
      `/factory/${factoryId}/workshop/${workshopId}/machineId/${machineId}`,
      payload,
      options,
    );
  }

  async deleteMachine(factoryId: string, workshopId: string, machineId: string, options?: RequestContext) {
    return this._requestServer(
      'delete',
      `/factory/${factoryId}/workshop/${workshopId}/machineId/${machineId}`,
      null,
      options,
    );
  }

  async getSensor(factoryId: string, workshopId: string, machineId: string, options?: RequestContext) {
    return this._requestServer(
      'get',
      `/factory/${factoryId}/workshop/${workshopId}/machine/${machineId}/sensor`,
      null,
      options,
    );
  }

  async addSensor(factoryId: string, workshopId: string, machineId: string, payload: Sensor, options?: RequestContext) {
    return this._requestServer(
      'post',
      `/factory/${factoryId}/workshop/${workshopId}/machine/${machineId}/sensor`,
      payload,
      options,
    );
  }

  async updateSensor(
    factoryId: string,
    workshopId: string,
    machineId: string,
    sensorId: string,
    payload: Sensor,
    options?: RequestContext,
  ) {
    return this._requestServer(
      'put',
      `/factory/${factoryId}/workshop/${workshopId}/machine/${machineId}/sensor/${sensorId}`,
      payload,
      options,
    );
  }

  async deleteSensor(
    factoryId: string,
    workshopId: string,
    machineId: string,
    sensorId: string,
    options?: RequestContext,
  ) {
    return this._requestServer(
      'put',
      `/factory/${factoryId}/workshop/${workshopId}/machine/${machineId}/sensor/${sensorId}`,
      null,
      options,
    );
  }
}
