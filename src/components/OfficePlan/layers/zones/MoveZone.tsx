import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/model'
import Konva from 'konva'
import { Line, Circle, Group, Rect, Image } from 'react-konva'
import { colors } from '@/shared/theme'
import {
  setDrawZoneFloor,
  setMoveZoneFloor,
} from '@/features/modal/floorPlan/model/slice'
import { useImage } from 'react-konva-utils'
import SaveIcon from '@/shared/assets/icons/saveIcon.svg'
import CancelIcon from '@/shared/assets/icons/cross.svg'
import { selectPageSlice, setIsOpenModal } from '@/entities/page/model/slice'
import { ModalTypes } from '@/entities/page'
import { useCreateUpdateZoneMutation } from '@/shared/api/zonesApi'
import { FloorsWithDevicesType } from '@/shared/api/facilitiesApi'
import { showNotificationSnackBar } from '@/entities/system-message'
import { t } from 'i18next'
import { ZonesToDisplayOnFloorType } from '@/features/modal/floorPlan/lib/transformZonesToDisplay'

interface MoveZoneProps {
  points: number[][]
  flattenedPoints: number[]
  isFinished: boolean
  currentFloorData: FloorsWithDevicesType | undefined
  movableZoneData: ZonesToDisplayOnFloorType
  handlePointDragMove: (e: Konva.KonvaEventObject<MouseEvent>) => void
  handleGroupDragEnd: (e: Konva.KonvaEventObject<MouseEvent>) => void
  setPolyComplete: React.Dispatch<React.SetStateAction<boolean>>
  setPoints: React.Dispatch<React.SetStateAction<number[][]>>
  scale: number
}

export const MoveZone: React.FC<MoveZoneProps> = ({
  points,
  flattenedPoints,
  isFinished,
  currentFloorData,
  movableZoneData,
  handlePointDragMove,
  handleGroupDragEnd,
  setPolyComplete,
  setPoints,
  scale,
}): JSX.Element => {
  const { elementInfo } = useAppSelector(selectPageSlice)
  const [createUpdZone] = useCreateUpdateZoneMutation()
  const dispatch = useAppDispatch()

  let vertexRadius

  if (scale < 2) {
    vertexRadius = 6
  } else if (scale > 6) {
    vertexRadius = 1
  } else {
    vertexRadius = 3
  }
  const [stage, setStage] = useState<Konva.Stage | null>(null)
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [saveIcon] = useImage(SaveIcon)
  const [cancelIcon] = useImage(CancelIcon)

  const handleGroupMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isFinished) return

    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'move'
      setStage(stage)
    }
  }

  const minMax = (points: number[]): [number, number] => {
    if (points.length === 0) {
      throw new Error('The points array is empty.')
    }

    return points.reduce<[number, number]>(
      (acc, val) => {
        if (val === undefined) {
          throw new Error('The points array contains undefined values.')
        }
        acc[0] = val < acc[0] ? val : acc[0]
        acc[1] = val > acc[1] ? val : acc[1]
        return acc
      },
      [Infinity, -Infinity],
    )
  }

  const dragBoundFunc = (
    stageWidth: number,
    stageHeight: number,
    vertexRadius: number,
    pos: { x: number; y: number },
  ): { x: number; y: number } => {
    let x = pos.x
    let y = pos.y
    if (pos.x + vertexRadius > stageWidth) x = stageWidth
    if (pos.x - vertexRadius < 0) x = 0
    if (pos.y + vertexRadius > stageHeight) y = stageHeight
    if (pos.y - vertexRadius < 0) y = 0
    return { x, y }
  }

  const handleGroupMouseOut = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    if (stage) {
      stage.container().style.cursor = 'default'
    }
  }
  const [minMaxX, setMinMaxX] = useState<[number, number]>([0, 0]) // min and max in x axis
  const [minMaxY, setMinMaxY] = useState<[number, number]>([0, 0]) // min and max in y axis

  const handleGroupDragStart = () => {
    const arrX = points.map(p => p[0])
    const arrY = points.map(p => p[1])
    const [minX, maxX] = minMax(arrX)
    const [minY, maxY] = minMax(arrY)
    setMinMaxX([minX * scale, maxX * scale])
    setMinMaxY([minY * scale, maxY * scale])
  }

  type Position = { x: number; y: number }

  const groupDragBound = (pos: Position) => {
    let { x, y } = pos

    if (stage) {
      const sw = stage.width()
      const sh = stage.height()
      if (minMaxY[0] + y < 0) y = -1 * minMaxY[0]
      if (minMaxX[0] + x < 0) x = -1 * minMaxX[0]
      if (minMaxY[1] + y > sh) y = sh - minMaxY[1]
      if (minMaxX[1] + x > sw) x = sw - minMaxX[1]
    }

    return { x, y }
  }

  const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault()
    if (points.length < 3) return
    setShowSaveButton(true)
    setPolyComplete(true)
    dispatch(setDrawZoneFloor(false))
  }

  const reset = () => {
    setPoints([])
    dispatch(setMoveZoneFloor(false))
  }

  // const undo = () => {
  //   setPoints(points.slice(0, -1))
  //   setPolyComplete(false)
  //   setPosition(points[points.length - 1])
  // }

  const onSubmitZone = async () => {
    if (!currentFloorData) return
    try {
      const zoneToSend = points.map(point => ({
        x: point[0] * (currentFloorData?.planLongitude / 1000),
        y: point[1] * (currentFloorData?.planLatitude / 550),
      }))

      zoneToSend.push(zoneToSend[0])

      const response = await createUpdZone({
        id: movableZoneData.id,
        floorId: currentFloorData?.id ?? 0,
        initialHeight: movableZoneData.initialHeight,
        finalHeight: movableZoneData.finalHeight,
        polygon: {
          points: zoneToSend,
        },
        zoneName: movableZoneData.name,
      }).unwrap()

      const prevFloorData = elementInfo.floor as FloorsWithDevicesType
      const updatedFloorData = {
        ...elementInfo.floor,
        zones: [
          ...prevFloorData.zones.filter(zone => zone.id !== movableZoneData.id),
          response,
        ],
      }

      dispatch(setIsOpenModal(false))
      dispatch(setMoveZoneFloor(false))
      dispatch(
        setIsOpenModal({
          isOpen: true,
          type: ModalTypes.createZoneFloorPlan,
          id: elementInfo?.floor?.id ?? 0,
          name: 'edit',
          floor: updatedFloorData as FloorsWithDevicesType,
          building: elementInfo.building,
        }),
      )

      const successMessage = t('modalTitle.zoneEditSuccess')

      dispatch(
        showNotificationSnackBar({
          type: 'success',
          message: successMessage,
        }),
      )

      reset()
    } catch (error: unknown) {
      const errorMessage = t('modalTitle.zoneEditError')
      dispatch(setMoveZoneFloor(false))
      dispatch(
        showNotificationSnackBar({
          type: 'error',
          message: errorMessage,
        }),
      )
    }
  }

  return (
    <>
      <Group
        name="polygon"
        draggable={isFinished}
        onDragStart={handleGroupDragStart}
        onDragEnd={handleGroupDragEnd}
        dragBoundFunc={groupDragBound}
        onMouseOver={handleGroupMouseOver}
        onMouseOut={handleGroupMouseOut}
        onContextMenu={handleContextMenu}
      >
        <Line
          points={flattenedPoints}
          stroke={colors.purple}
          strokeWidth={scale < 2 ? 3 : 1}
          closed={points.length > 2}
          fill="rgb(90, 87, 232, 0.2)"
        />
        {points.map((point, index) => {
          const x = point[0] - vertexRadius / 2
          const y = point[1] - vertexRadius / 2
          return (
            <Circle
              key={index}
              x={x}
              y={y}
              radius={vertexRadius}
              fill={colors.purple}
              stroke={colors.white}
              strokeWidth={1}
              draggable
              onDragMove={handlePointDragMove}
              dragBoundFunc={pos => {
                if (stage) {
                  return dragBoundFunc(
                    stage.width(),
                    stage.height(),
                    vertexRadius,
                    pos,
                  )
                }
                return pos
              }}
            />
          )
        })}
      </Group>
      {points.length > 2 && showSaveButton && (
        <Group>
          <Group
            x={points[0][0]}
            y={points[0][1] + 20 / scale + 0.7}
            onClick={() => {
              onSubmitZone()
              document.body.style.cursor = 'default' // Reset cursor style
            }}
            onMouseEnter={() => (document.body.style.cursor = 'pointer')}
            onMouseLeave={() => (document.body.style.cursor = 'default')}
          >
            <Rect
              width={25 / scale + 1}
              height={25 / scale + 1}
              fill={colors.bgDark}
              cornerRadius={1}
              offsetX={15 / scale}
              offsetY={0}
            />
            <Image
              x={-15 / scale}
              y={0}
              width={25 / scale + 1}
              height={25 / scale + 1}
              image={saveIcon}
              fill={colors.bgDark}
            />
          </Group>
          <Group
            x={points[0][0] + 30 / scale + 0.7}
            y={points[0][1] + 20 / scale + 0.7}
            onClick={() => {
              reset()
              document.body.style.cursor = 'default'
            }}
            onMouseEnter={() => (document.body.style.cursor = 'pointer')}
            onMouseLeave={() => (document.body.style.cursor = 'default')}
          >
            <Rect
              width={25 / scale + 1}
              height={25 / scale + 1}
              fill={colors.bgDark}
              cornerRadius={1}
              offsetX={15 / scale}
              offsetY={0}
            />
            <Image
              x={-15 / scale}
              y={0}
              width={25 / scale + 1}
              height={25 / scale + 1}
              image={cancelIcon}
              fill={colors.bgDark}
            />
          </Group>
        </Group>
      )}
    </>
  )
}
