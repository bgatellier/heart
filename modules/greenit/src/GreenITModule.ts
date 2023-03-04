import type { GreenITConfig, GreenITResult } from "@fabernovel/heart-common"
import { Module, ModuleAnalysisInterface, ModuleInterface, Report } from "@fabernovel/heart-common"
import { writeFileSync } from "node:fs"
import { cwd } from "node:process"
import { requestResult } from "./api/Client.js"

export class GreenITModule extends Module implements ModuleAnalysisInterface<GreenITConfig, GreenITResult> {
  private threshold?: number

  constructor(module: Pick<ModuleInterface, "name" | "service">) {
    super(module)
  }

  public async startAnalysis(conf: GreenITConfig, threshold?: number): Promise<Report<GreenITResult>> {
    this.threshold = threshold

    const result = await requestResult(conf)

    return this.handleResult(result)
  }

  private handleResult(result: GreenITResult): Report<GreenITResult> {
    const [date, time] = result.date.split(" ")
    const [day, month, year] = date.split("/")

    writeFileSync(cwd() + "/result.json", JSON.stringify(result))

    return new Report({
      analyzedUrl: result.url,
      date: new Date(`${year}-${month}-${day}T${time}`),
      result: result,
      note: result.grade,
      normalizedNote: result.ecoIndex,
      service: this.service,
      threshold: this.threshold,
    })
  }
}
