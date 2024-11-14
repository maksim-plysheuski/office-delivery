import { FloorsWithDevicesType } from '@/shared/api/facilitiesApi'
import {
  Checkbox,
  TextField,
  FormControlLabel,
  Box,
  Typography,
} from '@mui/material'
import { t } from 'i18next'

interface GridSettingsProps {
  isGridVisible: boolean
  setGridVisible: React.Dispatch<React.SetStateAction<boolean>>
  gridStep: number | string
  currentFloorData: FloorsWithDevicesType | undefined
  setGridStep: React.Dispatch<React.SetStateAction<number>>
}

export const GridSettings: React.FC<GridSettingsProps> = ({
  isGridVisible,
  setGridVisible,
  currentFloorData,
  gridStep,
  setGridStep,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGridVisible(event.target.checked)
  }

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim() // Remove leading/trailing spaces
    if (inputValue === '') {
      setGridStep(0)
    } else if (currentFloorData?.planLatitude) {
      const numericValue = Number(inputValue)
      const longestPlanSide =
        currentFloorData?.planLatitude > currentFloorData?.planLongitude
          ? currentFloorData?.planLatitude
          : currentFloorData?.planLongitude
      if (
        !isNaN(numericValue) &&
        numericValue >= 0 &&
        numericValue <= longestPlanSide
      ) {
        setGridStep(numericValue)
      }
    }
  }

  return (
    <Box display="flex" alignItems="center" minHeight={40}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isGridVisible}
            onChange={handleCheckboxChange}
            color="primary"
          />
        }
        label={t('labelList.turnOnGrid')}
      />
      {isGridVisible ? (
        <Box display="flex" alignItems="center">
          <Typography sx={{ marginRight: 1 }}>
            {t('labelList.gridGap')}
          </Typography>
          <TextField
            type="text"
            sx={{
              height: 40,
              width: 90,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#2f2f2f',
                borderRadius: '5px',

                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
            value={gridStep}
            onChange={handleNumberChange}
            variant="outlined"
            size="small"
          />
        </Box>
      ) : null}
    </Box>
  )
}
