import PropTypes from 'prop-types';

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  Avatar
} from '@mui/material';

import { ImListNumbered } from "react-icons/im";



export const OverviewProducts = (props) => {

  const { difference, positive = false, sx, value } = props;
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Total Products
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'info.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <ImListNumbered />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >

              </SvgIcon>

            </Stack>

          </Stack>
        )}
      </CardContent>
    </Card>

  );
};

OverviewProducts.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object
};
