import {
  Config,
  ModuleAnalysisInterface,
  ModuleListenerInterface,
  ModuleServerInterface,
  Result,
  Report,
} from "@fabernovel/heart-common"
import { CorsOptions } from "cors"
import ora from "ora"

export async function notifyListenerModules<R extends Result>(
  listenerModules: IterableIterator<ModuleListenerInterface>,
  report: Report<R>
): Promise<unknown[]> {
  const promises = Array.from(listenerModules, (listenerModule) => listenerModule.notifyAnalysisDone(report))

  return Promise.all(promises)
}

export async function startAnalysis<C extends Config, R extends Result>(
  module: ModuleAnalysisInterface<C, R>,
  conf: C,
  threshold?: number
): Promise<Report<R>> {
  const spinner = ora({ spinner: "hearts", interval: 200 })

  spinner.start("Analysis in progress...")

  try {
    const report = await module.startAnalysis(conf, threshold)

    const reportName = report.service ? `[${report.service.name}] ` : ""
    const messageParts = [`${reportName}${report.analyzedUrl}: ${report.note} (${report.normalizedNote}/100)`]

    if (report.resultUrl) {
      messageParts.push(`View full report: ${report.resultUrl}`)
    }

    if (report.isThresholdReached() === true) {
      messageParts.push("Your threshold is reached")
    } else if (report.isThresholdReached() === false) {
      messageParts.push("Your threshold is not reached")
    }

    spinner.succeed("Analysis completed.")
    console.info(messageParts.join(". ") + ".")

    return report
  } catch (error) {
    let reason = ""

    if (typeof error === "string") {
      reason = error
    } else if (error instanceof Error) {
      reason = error.message
    }

    if (reason.length > 0) {
      reason = ` Reason: ${reason}.`
    }

    spinner.fail(`Analysis failed.${reason}`)

    return Promise.reject()
  }
}

export function startServer(
  module: ModuleServerInterface,
  analysisModules: IterableIterator<ModuleAnalysisInterface<Config, Result>>,
  listenerModules: IterableIterator<ModuleListenerInterface>,
  port: number,
  cors?: CorsOptions
): void {
  module
    .startServer(Array.from(analysisModules), Array.from(listenerModules), port, cors)
    .on("listening", () => console.log(`Server listening on port ${port}`))
    .on("error", (error: NodeJS.ErrnoException) => {
      console.error(error.message)
      process.exit(1)
    })
}
