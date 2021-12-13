import styled from '@emotion/styled';
import { fontSizes, spacing } from '../../units';
import { theme as defaultTheme } from '../../theme';

const StyledBox = ({
  paddingX,
  paddingY,
  marginX,
  marginY,
  width,
  display,
  theme,
  ...props
}) => {

	// If no theme prop
	theme = defaultTheme;

  const padding = spacing[props.padding];
  let paddingTop = spacing[props.paddingTop];
  let paddingRight = spacing[props.paddingRight];
  let paddingBottom = spacing[props.paddingBottom];
  let paddingLeft = spacing[props.paddingLeft];
  if (paddingX) {
    paddingLeft = spacing[paddingX];
    paddingRight = spacing[paddingX];
  }
  if (paddingY) {
    paddingTop = spacing[paddingY];
    paddingBottom = spacing[paddingY];
  }
  let margin = spacing[props.margin];
  let marginTop = spacing[props.marginTop];
  let marginRight = spacing[props.marginRight];
  let marginBottom = spacing[props.marginBottom];
  let marginLeft = spacing[props.marginLeft];
  if (marginX) {
    marginLeft = spacing[marginX];
    marginRight = spacing[marginX];
  }
  if (marginY) {
    marginTop = spacing[marginY];
    marginBottom = spacing[marginY];
  }
  return {
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    width,
    display,
    fontFamily: theme.typography.fontFamily,
  };
};


const Box = styled.div(StyledBox)
export default Box;
