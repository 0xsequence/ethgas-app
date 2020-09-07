import { keyframes } from '~/style'

export const FadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const FadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`

export const BlipAnim = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    opacity: 0.9;
    transform: scale(1.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

export const Pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`
