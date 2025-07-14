
import 'i18next'
import { LanguageResources } from '../src/api/i18n/i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: LanguageResources
  }
}
