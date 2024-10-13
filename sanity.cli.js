/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = 'next_public_sanity_project_id_placeholder'
const dataset = 'next_public_sanity_dataset_placeholder'

export default defineCliConfig({ api: { projectId, dataset } })
