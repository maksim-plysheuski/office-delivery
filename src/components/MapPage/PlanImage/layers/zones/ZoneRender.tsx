import React, { useState } from 'react'
import { Group, Line, Rect, Text, Image } from 'react-konva'
import { colors } from '@/shared/theme'
import MoveIcon from '@/shared/assets/icons/ic_move.svg'
import EditIcon from '@/shared/assets/icons/pen.svg'
import DeleteIcon from '@/shared/assets/icons/bin.svg'
import { useImage } from 'react-konva-utils'
import { useAppDispatch, useAppSelector } from '@/shared/model'
import {
  selectPageSlice,
  setIsOpenModal,
  setPrevModalState,
} from '@/entities/page/model/slice'
import { ModalTypes } from '@/entities/page'
import { ZonesToDisplayOnFloorType } from '@/features/modal/floorPlan/lib/transformZonesToDisplay'
import { setMoveZoneFloor } from '@/features/modal/floorPlan/model/slice'

interface ZoneRenderProps {
  zone: ZonesToDisplayOnFloorType
  flattenedPoints: number[]
  name: string
  setPoints: React.Dispatch<React.SetStateAction<number[][]>>
  setMovableZoneData: React.Dispatch<
    React.SetStateAction<ZonesToDisplayOnFloorType>
  >
  scale: number
}

export const ZoneRender: React.FC<ZoneRenderProps> = ({
  zone,
  flattenedPoints,
  name,
  setPoints,
  setMovableZoneData,
  scale,
}) => {
  const dispatch = useAppDispatch()
  const { modalType, elementInfo } = useAppSelector(selectPageSlice)
  const [moveicon] = useImage(MoveIcon)
  const [editIcon] = useImage(EditIcon)
  const [delteIcon] = useImage(DeleteIcon)
  const [showName, setShowName] = useState<boolean>(false)
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)

  const handleGroupClick = () => {
    setShowName(!showName)
  }

  const handleZoneContextMenuClick = () => {
    setShowContextMenu(!showContextMenu)
  }

  const centerX =
    flattenedPoints.reduce(
      (sum, point, index) => (index % 2 === 0 ? sum + point : sum),
      0,
    ) /
    (flattenedPoints.length / 2)
  const centerY =
    flattenedPoints.reduce(
      (sum, point, index) => (index % 2 !== 0 ? sum + point : sum),
      0,
    ) /
    (flattenedPoints.length / 2)
  const adjustedRadius = (32 - 4) / 2 / scale

  const dispatchPrevModalState = () => {
    dispatch(
      setPrevModalState({
        type: modalType,
        isOpen: true,
        id: elementInfo.id,
        name: elementInfo.name,
        building: elementInfo.building,
        floor: elementInfo.floor,
        facilityId: elementInfo.facilityId,
      }),
    )
  }
  const onRemoveZone = () => {
    dispatchPrevModalState()
    dispatch(
      setIsOpenModal({
        isOpen: true,
        type: ModalTypes.deleteZone,
        id: zone.id,
        name: zone.name,
      }),
    )
  }

  const onMoveZone = () => {
    dispatch(setMoveZoneFloor(true))
    const transformedPointsArr = []
    for (let i = 0; i < flattenedPoints.length; i += 2) {
      const x = flattenedPoints[i]
      const y = flattenedPoints[i + 1]
      transformedPointsArr.push([x, y])
    }
    transformedPointsArr.pop() // remove dublicated point
    setMovableZoneData(zone)    
    setPoints(transformedPointsArr)
    setShowName(false)
    setShowContextMenu(false)
  }

  const onEditZone = () => {
    dispatchPrevModalState()
    dispatch(
      setIsOpenModal({
        isOpen: true,
        type: ModalTypes.updateZoneFloor,
        id: zone.id,
        name: zone.name,
        building: elementInfo.building,
        floor: elementInfo.floor,
      }),
    )
  }

  const zoneContextButtonConfigs = [
    {
      label: 'Edit',
      icon: editIcon,
      xPosGroup: flattenedPoints[0],
      yPosGroup: flattenedPoints[1] - adjustedRadius / scale - (30 / scale + 4),
      onClick: () => {
        document.body.style.cursor = 'default'
        onEditZone()
      },
    },
    {
      label: 'Move',
      icon: moveicon,
      xPosGroup: flattenedPoints[0] + 30 / scale + 0.7,
      yPosGroup: flattenedPoints[1] - adjustedRadius / scale - (30 / scale + 4),
      onClick: () => {
        document.body.style.cursor = 'default'
        onMoveZone()
      },
    },
    {
      label: 'Delete',
      icon: delteIcon,
      xPosGroup: flattenedPoints[0] + 60 / scale + 1.4,
      yPosGroup: flattenedPoints[1] - adjustedRadius / scale - (30 / scale + 4),
      onClick: () => {
        document.body.style.cursor = 'default'
        onRemoveZone()
      },
    },
  ]

  return (
    <Group
      name="polygon"
      onClick={e => {
        if (e.evt.button === 0) {
          handleGroupClick()
        }
        if (e.evt.button === 2) {
          handleZoneContextMenuClick()
        }
      }}
      onContextMenu={e => {
        e.evt.preventDefault()
      }}
    >
      <Line
        points={flattenedPoints}
        stroke={colors.purple}
        strokeWidth={scale < 2 ? 2 : 1}
        closed={true}
        fill="rgb(90, 87, 232, 0.2)"
      />
      {showName && (
        <Text
          x={centerX}
          y={centerY}
          text={name}
          fontSize={scale < 2 ? 13 : 6}
          fill="white"
          align="center"
          verticalAlign="middle"
        />
      )}
      {showContextMenu && (
        <Group>
          {zoneContextButtonConfigs.map(config => {
            return (
              <Group
                key={config.label}
                x={config.xPosGroup}
                y={config.yPosGroup}
                onClick={config.onClick}
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
                  image={config.icon}
                  fill={colors.bgDark}
                />
              </Group>
            )
          })}
        </Group>
      )}
    </Group>
  )
}
