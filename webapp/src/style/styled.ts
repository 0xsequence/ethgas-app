import _styled, { CreateStyled } from '@emotion/styled'
import { theme, ThemeInterface } from './Theme'
import { css as _css, ThemeUIStyleObject } from 'theme-ui'

export const styled = _styled as CreateStyled<ThemeInterface>

export const css = (args?: ThemeUIStyleObject) => _css(args)(theme)
