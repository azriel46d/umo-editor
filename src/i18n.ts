import { isRecord } from '@tool-belt/type-predicates'
import { merge } from 'ts-deepmerge'
import { createI18n } from 'vue-i18n'

import type { SupportedLocale } from '@/types'

import en_US from './locales/en-US.json'
import pt_BR from './locales/pt-BR.json'
import ru_RU from './locales/ru-RU.json'
import zh_CN from './locales/zh-CN.json'

const { options } = useStore()

const getLocale = (lang: SupportedLocale) => {
  const translations = options.value.translations?.[lang]
  if (isRecord(translations)) {
    return translations
  }
  return {}
}

watch(
  () => options.value.locale,
  (locale: string) => {
    console.log('change!!')
    i18n.global.locale.value = locale
  },
)

export const i18n = createI18n({
  legacy: false,
  locale: options.value.locale || 'en-US',
  defaultLocale: 'en-US',
  messages: {
    'en-US': merge(en_US, getLocale('en-US')),
    'pt-BR': merge(pt_BR, getLocale('pt-BR')),
    'zh-CN': merge(zh_CN, getLocale('zh-CN')),
    'ru-RU': merge(ru_RU, getLocale('ru-RU')),
  },
})
