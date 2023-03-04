import {
  LighthouseConfig,
  LighthouseResult,
  Module,
  ModuleAnalysisInterface,
  ModuleInterface,
  Report,
} from "@fabernovel/heart-common"
import { writeFileSync } from "fs"
import { cwd } from "process"
import { requestResult } from "./api/Client.js"
import { compute } from "./scoring/compute.js"

export class LighthouseModule
  extends Module
  implements ModuleAnalysisInterface<LighthouseConfig, LighthouseResult>
{
  private threshold?: number

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)
  }

  public async startAnalysis(conf: LighthouseConfig, threshold?: number): Promise<Report<LighthouseResult>> {
    this.threshold = threshold

    const result = await requestResult(conf)

    return this.handleResult(result)
  }

  private handleResult(result: LighthouseResult): Report<LighthouseResult> {
    const score = compute(result.categories, 1)

    writeFileSync(cwd() + "/lighthouse.json", JSON.stringify(result))

    return new Report({
      analyzedUrl: result.requestedUrl as string,
      date: new Date(result.fetchTime),
      result: result,
      service: this.service,
      note: score.toString(),
      normalizedNote: score,
      threshold: this.threshold,
    })
  }
}
