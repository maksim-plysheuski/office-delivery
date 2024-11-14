import React, { useEffect, useState } from 'react'
import { Circle, Image, Group, Rect } from 'react-konva'
import { useImage } from 'react-konva-utils'
import AnchorIcon from '@/shared/assets/icons/wirelessWhite.svg'
import SaveIcon from '@/shared/assets/icons/saveIcon.svg'
import CancelIcon from '@/shared/assets/icons/cross.svg'
import { colors } from '@/shared/theme'
import {
  AnchorsInBuildingType,
  FloorsWithDevicesType,
} from '@/shared/api/facilitiesApi'
import { t } from 'i18next'
import { useAppDispatch, useAppSelector } from '@/shared/model'
import { showNotificationSnackBar } from '@/entities/system-message'
import { setMoveAnchorFloor } from '@/features/modal/floorPlan/model/slice'
import { useCreateUpdateAnchorMutation } from '@/shared/api/anchorsApi'
import { selectPageSlice, setIsOpenModal } from '@/entities/page/model/slice'
import Konva from 'konva'
import { getMousePos } from '@/features/modal/floorPlan/lib/konva/getMousePos'

interface MoveAnchorProps {
  scale: number
  planIconSize: number
  currentFloorData: FloorsWithDevicesType | undefined
  movableAnchorData: AnchorsInBuildingType
  setMovableAnchorData: React.Dispatch<
    React.SetStateAction<AnchorsInBuildingType>
  >
}

export const MoveAnchor: React.FC<MoveAnchorProps> = ({
  scale,
  planIconSize,
  currentFloorData,
  movableAnchorData,
  setMovableAnchorData,
}) => {
  const [icon] = useImage(AnchorIcon)
  const [saveIcon] = useImage(SaveIcon)
  const [cancelIcon] = useImage(CancelIcon)
  const dispatch = useAppDispatch()
  const [createUpdateAnchor] = useCreateUpdateAnchorMutation()
  const { elementInfo, modalType } = useAppSelector(selectPageSlice)

  const [showSaveButton, setShowSaveButton] = useState(false)

  const handleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const mousePos = getMousePos(stage)
    setMovableAnchorData(prevData => {
      return { ...prevData, x: mousePos[0], y: mousePos[1] }
    })
    setShowSaveButton(false)
  }
  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const mousePos = getMousePos(stage)
    setMovableAnchorData(prevData => {
      return { ...prevData, x: mousePos[0], y: mousePos[1] }
    })
    setShowSaveButton(true)
  }

  const adjustedRadius = (planIconSize - 4) / 2 / scale

  const onSaveAnchor = async () => {
    if (!currentFloorData) return
    try {
      const response = await createUpdateAnchor({
        id: movableAnchorData.id,
        externalId: movableAnchorData?.externalId,
        x: movableAnchorData?.x * (currentFloorData.planLongitude / 1000),
        y: movableAnchorData?.y * (currentFloorData.planLatitude / 550),
        z: movableAnchorData?.z,
        buildingId: currentFloorData?.buildingId ?? 0,
        floorId: currentFloorData?.id ?? 0,
      }).unwrap()

      const prevFloorData = elementInfo.floor as FloorsWithDevicesType
      const updatedFloorData = {
        ...elementInfo.floor,
        anchors: [
          ...prevFloorData.anchors.filter(
            anchor => anchor.id !== movableAnchorData?.id,
          ),
          response,
        ],
      }

      dispatch(setIsOpenModal(false))
      dispatch(
        setIsOpenModal({
          isOpen: true,
          type: modalType,
          id: elementInfo?.floor?.id ?? 0,
          name: 'edit',
          floor: updatedFloorData as FloorsWithDevicesType,
          building: elementInfo.building,
        }),
      )

      const successMessage = t('modalTitle.radioTagEditSuccess')

      dispatch(
        showNotificationSnackBar({
          type: 'success',
          message: successMessage,
        }),
      )
    } catch (error: unknown) {
      const errorMessage = t('modalTitle.radioTagEditError')

      dispatch(
        showNotificationSnackBar({
          type: 'error',
          message: errorMessage,
        }),
      )
    } finally {
      dispatch(setMoveAnchorFloor(false))
    }
  }

  const onCancelMoveAnchor = () => {
    setMovableAnchorData({
      id: 0,
      externalId: '',
      x: 0,
      y: 0,
      z: 0,
    })
    dispatch(setMoveAnchorFloor(false))
  }

  useEffect(() => {
    if (movableAnchorData?.x !== 0 && !showSaveButton) {
      setShowSaveButton(true)
    } else return
  }, [])

  return (
    <React.Fragment>
      <Circle
        x={movableAnchorData.x}
        y={movableAnchorData.y}
        radius={adjustedRadius}
        fill={colors.purple}
        stroke="white"
        strokeWidth={2}
        strokeScaleEnabled={false}
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />
      <Image
        x={movableAnchorData.x - adjustedRadius}
        y={movableAnchorData.y - adjustedRadius}
        width={adjustedRadius * 2}
        height={adjustedRadius * 2}
        image={icon}
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        opacity={showSaveButton ? 1 : 0}
        onMouseEnter={() => (document.body.style.cursor = 'grab')}
        onMouseLeave={() => (document.body.style.cursor = 'default')}
      />
      {showSaveButton && (
        <Group>
          <Group
            x={movableAnchorData.x}
            y={movableAnchorData.y - adjustedRadius / scale - (30 / scale + 4)}
            onClick={() => {
              onSaveAnchor()
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
              image={saveIcon}
              fill={colors.bgDark}
            />
          </Group>
          <Group
            x={movableAnchorData.x + 30 / scale + 0.7}
            y={movableAnchorData.y - adjustedRadius / scale - (30 / scale + 4)}
            onClick={() => {
              onCancelMoveAnchor()
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
    </React.Fragment>
  )
}
