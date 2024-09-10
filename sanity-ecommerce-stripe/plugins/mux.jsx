import {defineConfig} from 'sanity'
import {muxInput} from 'sanity-plugin-mux-input'

export default defineConfig({
  plugins: [muxInput()],
})