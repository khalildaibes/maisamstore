/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = 'NEXT_PUBLIC_SANITY_PROJECT_ID_PLACEHOLDER'
const dataset = 'NEXT_PUBLIC_SANITY_DATASET_PLACEHOLDER'

export default defineCliConfig({ api: { projectId, dataset } })
