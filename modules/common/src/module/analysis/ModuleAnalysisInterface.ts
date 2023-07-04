import type { Config } from "../config/Config.js"
import type { Result } from "../../report/Result.js"
import type { ModuleInterface } from "../ModuleInterface.js"
import type { GenericReport } from "../../index.js"

/**
 * Define an Analysis module.
 */
export interface ModuleAnalysisInterface<C extends Config, R extends GenericReport<Result>>
  extends ModuleInterface {
  startAnalysis: (conf: C, thresholds?: number) => Promise<R>
}

/**
 * Constructor interface signature
 * @see {@link https://www.typescriptlang.org/docs/handbook/interfaces.html#difference-between-the-static-and-instance-sides-of-classes}
 */
export type ModuleAnalysis<
  C extends Config,
  R extends GenericReport<Result>
> = new () => ModuleAnalysisInterface<C, R>

/**
 * Checks if a module is an Analysis one.
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates | User-Defined Type Guards}
 */
export function isModuleAnalysis<C extends Config, R extends GenericReport<Result>>(
  module: ModuleInterface
): module is ModuleAnalysisInterface<C, R> {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (module as ModuleAnalysisInterface<C, R>).startAnalysis !== undefined
}