const colors = {
  // TODO: review
  text: '#DFE6F2',
  textsecondary: '#D3D3FF',
  background: '#0B0E21',
  // background: 'white',
  secondarybackground: '#0B0E31',
  primary: '#83C7F8',
  secondary: '#355A91',
  tertiary: '#1f346b',
  inputbg: '#1a2d5b',
  muted: '#191919',
  highlight: '#29112c',
  lightgrey: '#B3B3B3',
  darkgrey: '#505050',
  accent: '#E57134',
  black: 'black',
  window: {
    background: '#fff'
  },

  link: '#bec2d5',
  linkHover: '#7B3F99',

  white: '#ffffff',
  red: '#FF565E',
  green: '#3ED598',
  yellow: '#FFC542',
  blue: '#1947E5',
  grey: '#E5E5E5',
  hint: '#bec2d5'
}

const space = [0, 4, 8, 16, 32, 64, 128]

const breakpoints = ['0px', '680px', '900px', '1080px', '1440px']

const fonts = {
  body: '"Montserrat", sans-serif',
  heading: 'inherit',
  monospace: 'Menlo, monospace'
}

const fontSizes = [14, 16, 18, 20, 24, 30]

const fontWeights = {
  body: 500,
  bold: 700,
  heading: 800
}

const lineHeights = {
  body: 1.5,
  heading: 1.25
}

const sizes = {
  sidebar: 256,
  container: 1024
}

const text = {
  heading: {
    fontFamily: 'heading',
    fontWeight: 'heading',
    lineHeight: 'heading'
  },
  // display: {
  //   variant: 'text.heading',
  //   fontSize: [5, 6],
  //   fontWeight: 'display',
  //   letterSpacing: '-0.03em',
  //   mt: 3
  // }
}

const buttons = {
  primary: {
    color: 'background',
    bg: 'primary',
    fontWeight: 'bold',
    px: 2,
    py: 2,
    cursor: 'pointer',
    '&:hover': {
      bg: 'secondary'
    },
    disabled: {
      color: 'lightgrey',
      bg: 'darkgrey',
      cursor: 'not-allowed'
    }
  },
  secondary: {
    color: 'primary',
    textTranform: 'uppercase',
    bg: 'background',
    border: '2px solid',
    borderColor: 'primary',
    cursor: 'pointer',
    disabled: {
      color: 'lightgrey',
      borderColor: 'lightgrey',
      border: '2px solid',
      bg: 'background',
      cursor: 'not-allowed'
    }
  },
  tertiary: {
    color: 'primary',
    textTranform: 'uppercase',
    bg: 'tertiary',
    border: '2px solid',
    borderColor: 'rgba(0,0,0,0)',
    cursor: 'pointer',
    disabled: {
      color: 'lightgrey',
      borderColor: 'lightgrey',
      border: '2px solid',
      bg: 'tertiary',
      cursor: 'not-allowed'
    }
  },
  warning: {
    color: 'warning',
    textTranform: 'uppercase',
    bg: 'background',
    border: '2px solid',
    borderColor: 'warning',
    cursor: 'pointer',
    ':hover': {
      bg: 'rgba(255,0,0,0.1)',
      color: 'warning'
    },
    disabled: {
      color: 'lightgrey',
      borderColor: 'lightgrey',
      border: '2px solid',
      bg: 'background',
      cursor: 'not-allowed'
    }
  }
}

const links = {
  button: {
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: 2,
    p: 3,
    color: 'background',
    bg: 'text',
    borderRadius: 6,
    '&:hover, &:focus': {
      color: 'background',
      bg: 'primary'
    }
  },
  nav: {
    display: 'block',
    width: '100%',
    px: 2,
    py: 2,
    color: 'inherit',
    textDecoration: 'none',
    fontSize: 1,
    fontWeight: 'bold',
    bg: 'transparent',
    transitionProperty: 'background-color',
    transitionTimingFunction: 'ease-out',
    transitionDuration: '.2s',
    borderRadius: 2,
    '&:hover': {
      bg: 'highlight'
    },
    '&.active': {
      color: 'primary',
      bg: 'highlight'
    }
  }
}

const images = {
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999
  }
}

const forms = {
  label: {
    fontSize: 1,
    fontWeight: 'normal',
    color: 'text'
  },
  input: {
    borderColor: 'secondary',
    borderRadius: '8px',
    fontFamily: 'body',
    bg: 'inputbg',
    color: 'white',
    py: 3,
    '&:focus': {
      borderColor: 'primary',
      boxShadow: t => `0 0 0 1px ${t.colors.primary}`,
      outline: 'none'
    },
    '&::placeholder': {
      color: 'text'
    }
  },
  select: {
    borderColor: 'secondary',
    borderRadius: '8px',
    color: 'text',
    '&:focus': {
      borderColor: 'primary',
      boxShadow: t => `0 0 0 1px ${t.colors.primary}`,
      outline: 'none'
    }
  },
  textarea: {
    borderColor: 'secondary',
    borderRadius: '8px',
    bg: 'inputbg',
    color: 'text',
    '&:focus': {
      borderColor: 'primary',
      boxShadow: t => `0 0 0 1px ${t.colors.primary}`,
      outline: 'none'
    }
  },
  slider: {
    bg: 'muted'
  }
}

const alerts = {
  primary: {
    color: 'background'
  },
  secondary: {
    color: 'background',
    bg: 'secondary'
  },
  accent: {
    color: 'background',
    bg: 'accent'
  },
  highlight: {
    color: 'text',
    bg: 'highlight'
  }
}

const layout = {
  container: {
    p: 3
    // maxWidth: 1024,
  }
}

const styles = {
  root: {
    margin: 0,
    fontFamily: 'body',
    lineHeight: 'body',
    fontWeight: 'body',
    fontSize: 2,
    minWidth: '300px'
  },
  img: {
    maxWidth: '100%',
    height: 'auto'
  },
  h1: {
    variant: 'text.heading',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: 5,
    mb: 4
  },
  h2: {
    variant: 'text.heading',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: 4,
    mb: 4
  },
  h3: {
    variant: 'text.heading',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: 3,
    mb: 3
  },
  p: {
    variant: 'text.heading',
    fontFamily: 'Montserrat',
    fontWeight: 'regular',
    fontSize: 2,
    mb: 3
  },
  a: {
    color: 'link',
    '&:hover': {
      color: 'linkHover'
    }
  },
  pre: {
    fontFamily: 'monospace',
    fontSize: 1,
    p: 3,
    color: 'text',
    bg: 'muted',
    overflow: 'auto',
    code: {
      color: 'inherit'
    },
    variant: 'prism'
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 1
  },
  inlineCode: {
    fontFamily: 'monospace',
    color: 'secondary',
    bg: 'muted'
  },
  // table: {
  //   width: '100%',
  //   my: 4,
  //   borderCollapse: 'separate',
  //   borderSpacing: 0
  //   // [['th', 'td']]: {
  //   //   textAlign: 'left',
  //   //   py: '4px',
  //   //   pr: '4px',
  //   //   pl: 0,
  //   //   borderColor: 'muted',
  //   //   borderBottomStyle: 'solid',
  //   // },
  // },
  th: {
    verticalAlign: 'bottom',
    borderBottomWidth: '2px'
  },
  td: {
    verticalAlign: 'top',
    borderBottomWidth: '1px'
  },
  hr: {
    border: 0,
    borderBottom: '1px solid',
    borderColor: 'secondary'
  },
  xray: {
    '*': {
      outline: '1px solid rgba(0, 192, 255, .25)'
    }
  },
  navlink: {
    display: 'inline-block',
    fontWeight: 'bold',
    color: 'inherit',
    textDecoration: 'none',
    ':hover,:focus': {
      color: 'primary'
    }
  }
}


export const theme = {
  colors,
  space,
  breakpoints,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  sizes,
  text,
  buttons,
  links,
  images,
  forms,
  alerts,
  layout,
  styles,
}

export type ThemeInterface = typeof theme
