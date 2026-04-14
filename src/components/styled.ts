import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/** Full-height flex column root -- use as page container */
export const PageRoot = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

/** Pushes siblings apart inside a flex row */
export const FlexSpacer = styled(Box)({ flexGrow: 1 });

/** Tab / section content pane: padded, scrollable */
export const SectionPane = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  overflowY: 'auto',
  height: '100%',
}));

/** Centered empty-state container */
export const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
  height: '100%',
  color: theme.palette.text.disabled,
}));

/** Key/value detail row */
export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

/** Label cell in a DetailRow */
export const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  width: 140,
  flexShrink: 0,
  color: theme.palette.custom.labelGray,
  fontSize: theme.typography.body2.fontSize,
}));

/** Muted / disabled-color Typography */
export const MutedText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
})) as typeof Typography;

/** Label-gray Typography */
export const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.labelGray,
}));

/** Section heading: subtitle1 bold with bottom margin */
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: theme.typography.subtitle1.fontSize,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));
