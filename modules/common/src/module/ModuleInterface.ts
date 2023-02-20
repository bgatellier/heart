import { Service } from "../service/Service.js"

export interface ModuleInterface {
  /**
   * Example: observatory
   */
  id: string

  /**
   * Example: Heart Observatory
   */
  name: string

  service: Service
}