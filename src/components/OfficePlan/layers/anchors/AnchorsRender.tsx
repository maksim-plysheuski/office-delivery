import { FloorsType } from '@/shared/api/floorsApi'
import { AnchorsInBuildingType } from '@/shared/api/facilitiesApi'

interface AnchorsRenderProps {
  scale: number
  planIconSize: number
  currentFloorData: FloorsType | undefined
  anchorsFloor: AnchorsInBuildingType[]
  setMovableAnchorData: React.Dispatch<
    React.SetStateAction<AnchorsInBuildingType>
  >
}

import { Circle, Group, Image, Label, Rect, Tag, Text } from 'react-konva'
import { useImage } from 'react-konva-utils'
import AnchorSvg from '@/shared/assets/icons/wirelessWhite.svg'
import MoveIcon from '@/shared/assets/icons/ic_move.svg'
import EditIcon from '@/shared/assets/icons/pen.svg'
import DeleteIcon from '@/shared/assets/icons/bin.svg'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '@/shared/theme'
import {
  selectPageSlice,
  setIsOpenModal,
  setPrevModalState,
} from '@/entities/page/model/slice'
import { useAppDispatch, useAppSelector } from '@/shared/model'
import { ModalTypes } from '@/entities/page'
import {
  selectFloorSlice,
  setMoveAnchorFloor,
} from '@/features/modal/floorPlan/model/slice'

export const AnchorRender: React.FC<AnchorsRenderProps> = ({
  scale,
  planIconSize,
  currentFloorData,
  anchorsFloor,
  setMovableAnchorData,
}) => {
  const [moveicon] = useImage(MoveIcon)
  const [editIcon] = useImage(EditIcon)
  const [delteIcon] = useImage(DeleteIcon)
  const [anchorSvg] = useImage(AnchorSvg)
  const { modalType, elementInfo } = useAppSelector(selectPageSlice)
  const { moveAnchorFloor } = useAppSelector(selectFloorSlice)
  const dispatch = useAppDispatch()
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null)
  const [selectedContextMenuAnchor, setSelectedContextMenuAnchor] = useState<
    string | null
  >(null)
  const labelRef = useRef<React.ComponentProps<typeof Label>>(null)

  useEffect(() => {
    if (labelRef.current) {
      labelRef.current.getLayer().batchDraw()
      labelRef.current.moveToTop()
    }
  }, [selectedAnchor])

  return anchorsFloor.map(anchor => {
    if (!currentFloorData?.planLatitude || moveAnchorFloor) return null

    const xPos =
      (1000 / currentFloorData.planLongitude) * anchor.x -
      2 / scale
    const yPos =
      (550 / currentFloorData.planLatitude) * anchor.y -
      2 / scale

    const adjustedRadius = (planIconSize - 4) / 2 / scale
    const fontSize = 14 / scale

    const handleAnchorClick = (externalId: string) => {
      setSelectedAnchor(prev => (prev === externalId ? null : externalId))
    }

    const handleAnchorContextMenuClick = (externalId: string) => {
      setSelectedContextMenuAnchor(prev =>
        prev === externalId ? null : externalId,
      )
    }

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

    const onRemoveAnchor = () => {
      dispatchPrevModalState()
      dispatch(
        setIsOpenModal({
          isOpen: true,
          type: ModalTypes.deleteAnchor,
          id: anchor.id,
          name: anchor.externalId,
        }),
      )
    }

    const onMoveAnchor = () => {
      setMovableAnchorData({ ...anchor, x: xPos, y: yPos })
      dispatch(setMoveAnchorFloor(true))
      setSelectedAnchor(null)
      setSelectedContextMenuAnchor(null)
    }

    const onEditAnchor = () => {
      dispatchPrevModalState()
      dispatch(
        setIsOpenModal({
          isOpen: true,
          type: ModalTypes.updateAnchorFloor,
          id: anchor.id,
          name: anchor.externalId,
          anchor: anchor,
          building: elementInfo.building,
          floor: elementInfo.floor,
        }),
      )
    }

    const anchorButtonConfigs = [
      {
        label: 'Edit',
        icon: editIcon,
        xPosGroup: xPos,
        yPosGroud: yPos - adjustedRadius / scale - (30 / scale + 4),
        onClick: () => {
          document.body.style.cursor = 'default'
          onEditAnchor()
        },
      },
      {
        label: 'Move',
        icon: moveicon,
        xPosGroup: xPos + 30 / scale + 0.7,
        yPosGroud: yPos - adjustedRadius / scale - (30 / scale + 4),
        onClick: () => {
          document.body.style.cursor = 'default'
          onMoveAnchor()
        },
      },
      {
        label: 'Delete',
        icon: delteIcon,
        xPosGroup: xPos + 60 / scale + 1.4,
        yPosGroud: yPos - adjustedRadius / scale - (30 / scale + 4),
        onClick: () => {
          // Handle delete button click
          document.body.style.cursor = 'default'
          onRemoveAnchor()
        },
      },
    ]

    return (
      <React.Fragment key={anchor.externalId}>
        <Circle
          x={xPos}
          y={yPos}
          radius={adjustedRadius}
          fill={colors.purple}
          stroke="white"
          strokeWidth={2}
          strokeScaleEnabled={false}
        />
        <Image
          x={xPos - adjustedRadius}
          y={yPos - adjustedRadius}
          width={adjustedRadius * 2}
          height={adjustedRadius * 2}
          image={anchorSvg}
          onClick={e => {
            if (e.evt.button === 0) {
              handleAnchorClick(anchor.externalId)
            }
            if (e.evt.button === 2) {
              handleAnchorContextMenuClick(anchor.externalId)
            }
          }}
          onContextMenu={e => {
            e.evt.preventDefault()
          }}
        />
        {selectedAnchor === anchor.externalId && (
          //@ts-expect-error ref is not the right type
          <Label x={xPos} y={yPos + adjustedRadius + 3 / scale} ref={labelRef}>
            <Tag
              fill={colors.bgDark}
              stroke={colors.bgDark}
              strokeWidth={1 / scale}
              cornerRadius={5 / scale}
              pointerDirection="up"
              pointerWidth={10 / scale}
              pointerHeight={10 / scale}
              lineJoin="round"
            />
            <Text
              text={anchor.externalId}
              fontSize={fontSize}
              fill={colors.white}
              padding={5 / scale}
              align="center"
            />
          </Label>
        )}
        {selectedContextMenuAnchor === anchor.externalId && (
          <Group>
            {anchorButtonConfigs.map(config => {
              return (
                <Group
                  key={config.label}
                  x={config.xPosGroup}
                  y={config.yPosGroud}
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
      </React.Fragment>
    )
  })
}
