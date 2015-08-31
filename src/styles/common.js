import spacing from 'power-ui/styles/spacing';
import palette from 'power-ui/styles/palette';

export default {
  inputFieldStyle: {
    'margin-left': spacing.smaller,
    'font-weight': 'normal',
    'border-radius': '5px',
    'border': '1px solid #d0d0d0',
    'padding': `${spacing.tiny} ${spacing.small}`,
  },

  contentWrapperStyle: {
    'margin': `${spacing.normal} ${spacing.big}`,
    'display': 'flex',
    'flex-direction': 'column',
  },

  borderBottomLineStyle: {
    'border-bottom': `solid 1px ${palette.grayLight}`,
    'padding-bottom': spacing.small,
  },
};
