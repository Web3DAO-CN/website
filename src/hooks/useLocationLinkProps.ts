import { SupportedLocale } from 'constants/locales'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { stringify } from 'qs'
import { useMemo } from 'react'
// import ReactGA from 'react-ga'
import { To, useLocation } from 'react-router-dom'

export function useLocationLinkProps(locale: SupportedLocale | null): {
  to?: To
  onClick?: () => void
} {
  const location = useLocation()
  const qs = useParsedQueryString()

  return useMemo(
    () =>
      !locale
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, lng: locale }),
            },
            onClick: () => {
              // ReactGA.event({
              //   category: 'Localization',
              //   action: 'Switch Locale',
              //   label: `${activeLocale} -> ${locale}`,
              // })
            },
          },
    [location, qs, locale]
  )
}
