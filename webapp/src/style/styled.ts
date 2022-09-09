import _styled, { CreateStyled } from '@emotion/styled'
import { css as _css, ThemeUIStyleObject } from 'theme-ui'

import { theme, ThemeInterface } from './Theme'

export const styled = _styled as CreateStyled<ThemeInterface>

export const css = (args?: ThemeUIStyleObject) => _css(args)(theme)
