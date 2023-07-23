import {
  isModuleListenerDatabase,
  type Config,
  type ModuleListenerDatabaseInterface,
  type ModuleListenerInterface,
} from "@fabernovel/heart-common"
import type { FastifyCorsOptions } from "@fastify/cors"
import { Command } from "commander"
import { readFileSync } from "node:fs"
import { argv } from "node:process"
import type { PackageJson } from "type-fest"
import { loadEnvironmentVariables, loadModules } from "../../module/ModuleLoader.js"
import { migrateListenerDatabase } from "../../module/ModuleMigration.js"
import { notifyListenerModules, startAnalysis, startServer } from "../../module/ModuleOrchestrator.js"
import { createAnalysisSubcommand } from "../analysis/AnalysisCommand.js"
import { createServerSubcommand } from "../server/ServerCommand.js"

/**
 * Create the Commander Command object.
 * Set the command version to match the one defined in the package.json file.
 */
function createCommand(): Command {
  const cmd = new Command()

  const packageJsonUrl = new URL("../../../package.json", import.meta.url)
  const packageJson = JSON.parse(readFileSync(packageJsonUrl, "utf8")) as PackageJson

  cmd.version(packageJson.version ?? "")

  return cmd
}

/**
 * 1. Load every modules referenced in package.json.
 * 2. Create the CLI command: one CLI argument per analysis and server module.
 * @returns
 */
export async function start(): Promise<Command> {
  const cmd = createCommand()
  const [analysisModulesMap, listenerModulesMap, serverModulesMap] = await loadModules()
  const listenerModules = Array.from(listenerModulesMap.values()).map((listenerModule) => listenerModule)
  const listenerDatabaseModules = listenerModules.filter((m): m is ModuleListenerDatabaseInterface =>
    isModuleListenerDatabase(m)
  )

  // run database migrations for Listener database modules
  if (listenerDatabaseModules.length > 0) {
    await migrateListenerDatabase(listenerDatabaseModules)
  }

  // create and add 1 command for each analysis module
  analysisModulesMap.forEach((analysisModule, modulePath) => {
    const callback = async <C extends Config>(
      config: C,
      threshold: number | undefined,
      listenerModulesFiltered: ModuleListenerInterface[]
    ) => {
      loadEnvironmentVariables(modulePath)

      const report = await startAnalysis(analysisModule, config, threshold)

      // notify filtered listener modules
      await notifyListenerModules(listenerModulesFiltered, report)
    }

    const analysisCommand = createAnalysisSubcommand(analysisModule, listenerModules, callback)

    cmd.addCommand(analysisCommand)
  })

  // create and add 1 command for each server module
  serverModulesMap.forEach((serverModule, modulePath: string) => {
    const callback = async (port: number, cors: FastifyCorsOptions | undefined) => {
      // load environment variables for the server module
      loadEnvironmentVariables(modulePath)

      // load environment variables for the analysis modules:
      // do it once at startup instead at each route call
      analysisModulesMap.forEach((_module, modulePath) => {
        loadEnvironmentVariables(modulePath)
      })

      await startServer(serverModule, analysisModulesMap.values(), listenerModules, port, cors)
    }

    const serverCommand = createServerSubcommand(serverModule, callback)

    cmd.addCommand(serverCommand)
  })

  // listener modules: load and validate environment variables
  listenerModulesMap.forEach((_, modulePath) => {
    loadEnvironmentVariables(modulePath)
  })

  return cmd
    .on("command:*", () => {
      cmd.error("Invalid command name.")
    })
    .parseAsync(argv)
}
