import _styled, { CreateStyled } from '@emotion/styled'
import { theme, ThemeInterface } from './Theme'
import { css as _css, ThemeUIStyleObject } from 'theme-ui'

export const styled = _styled as CreateStyled<ThemeInterface>

// TODO: perhaps rename to styledCss ..?
// and leave emotion css untouched?
export const css = (args?: ThemeUIStyleObject) => _css(args)(theme)
