import type { ISyncServices } from "../ISyncService";
import SendgridService from "./SendgridService";

const services: ISyncServices[] = [
  SendgridService as unknown as ISyncServices,
];

export default services;
