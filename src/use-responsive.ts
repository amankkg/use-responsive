import * as breakpoints from './default-breakpoints'
import {stringifyMediaQuery} from './media-query-kit'

type MediaQueryBreakpoint = string | {[key: string]: string}
type CustomQueryOption<T> = readonly [MediaQueryBreakpoint, T]
type StringQueryOption<T> = readonly [string, T]
type OptionsArray<T> = Array<T | CustomQueryOption<T>>

// TODO: add more type-level stuff, overload typedefs, etc. so it looks strict and very elite
function useResponsive<T>(options: OptionsArray<T>): T {
  if (options.length === 0)
    throw new Error('TODO: yell that options cannot be empty')

  if (options.some(() => false)) {
    throw new Error(
      'TODO: yell that non-custom query option cannot come after custom query one',
    )
  }

  if (options.some(() => false)) {
    throw new Error(
      'TODO: yell all additional options (i.e. beyond first 5 arguments) must have custom query',
    )
  }

  const [[, defaultElement], ...customQueryOptions] = options.map(
    monotonizeOption,
  )
  const matched = [defaultElement]

  for (const [mediaQuery, element] of customQueryOptions) {
    if (window.matchMedia(mediaQuery).matches) matched.unshift(element)
  }

  return matched[0]
}

const defaultBreakpoints = new Map()
  .set(1, breakpoints.viewport4)
  .set(2, breakpoints.viewport7)
  .set(3, breakpoints.viewport9)
  .set(4, breakpoints.viewport12)

function monotonizeOption<T>(
  ambiguousOption: T | CustomQueryOption<T>,
  index: number,
): StringQueryOption<T> {
  if (isCustomQueryOption(ambiguousOption)) {
    const [breakpoint, element] = ambiguousOption

    return [stringifyMediaQuery(breakpoint), element]
  }

  const breakpoint = index > 0 ? defaultBreakpoints.get(index) : 'noop query'

  return [breakpoint, ambiguousOption]
}

function isCustomQueryOption<T>(value: any): value is CustomQueryOption<T> {
  return Array.isArray(value)
}

export {useResponsive}