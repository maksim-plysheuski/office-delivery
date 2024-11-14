import { FloorsWithDevicesType } from '@/shared/api/facilitiesApi'
import { Html } from 'react-konva-utils'

interface GridProps {
  currentFloorData: FloorsWithDevicesType | undefined
  scale: number
  gridStep: number
}

export const Grid: React.FC<GridProps> = ({
  currentFloorData,
  scale,
  gridStep,
}): JSX.Element => {
  const clientWidth = 1000
  const clientHeight = 550
  const planLongitude = currentFloorData?.planLongitude ?? 1
  const planLatitude = currentFloorData?.planLatitude ?? 1

  const gridStepX = (clientWidth / planLongitude) * gridStep
  const gridStepY = (clientHeight / planLatitude) * gridStep

  const getGridGapStyle = () => `${gridStepX}px ${gridStepY}px`
  const getGridPxWidth = () => {
    if (scale > 5) {
      return 0.1
    }
    if (scale > 2) {
      return 0.5
    }
    return 1
  }
  return (
    <Html
      divProps={{
        style: {
          backgroundSize: getGridGapStyle(),
          backgroundImage: `
linear-gradient(to right, var(--redPrimary) ${getGridPxWidth()}px, transparent ${getGridPxWidth()}px),
linear-gradient(to bottom, var(--redPrimary) ${getGridPxWidth()}px, transparent ${getGridPxWidth()}px)
`,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1000px',
          height: '550px',
          zIndex: 99,
          pointerEvents: 'none',
        },
      }}
    >
      <div></div>
    </Html>
  )
}
