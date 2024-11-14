import React, { useEffect, useState } from 'react'
import { Circle, Image, Group, Rect } from 'react-konva'
import { useImage } from 'react-konva-utils'
import AnchorIcon from '@/shared/assets/icons/wirelessWhite.svg'
import SaveIcon from '@/shared/assets/icons/saveIcon.svg'
import DeleteIcon from '@/shared/assets/icons/bin.svg'
import { colors } from '@/shared/theme'
import { FloorsWithDevicesType } from '@/shared/api/facilitiesApi'
import { t } from 'i18next'
import { useAppDispatch, useAppSelector } from '@/shared/model'
import { showNotificationSnackBar } from '@/entities/system-message'
import { setDrawAnchorFloor } from '@/features/modal/floorPlan/model/slice'
import { useCreateUpdateAnchorMutation } from '@/shared/api/anchorsApi'
import { selectPageSlice, setIsOpenModal } from '@/entities/page/model/slice'
import { ModalTypes } from '@/entities/page'
import Konva from 'konva'
import { getMousePos } from '@/features/modal/floorPlan/lib/konva/getMousePos'

interface DrawAnchorProps {
  scale: number
  planIconSize: number
  currentFloorData: FloorsWithDevicesType | undefined
  newAnchor: { x: number; y: number }
  setNewAnchor: React.Dispatch<
    React.SetStateAction<{
      x: number
      y: number
    }>
  >
}

export const DrawAnchor: React.FC<DrawAnchorProps> = ({
  scale,
  planIconSize,
  currentFloorData,
  newAnchor,
  setNewAnchor,
}) => {
  const [icon] = useImage(AnchorIcon)
  const [saveIcon] = useImage(SaveIcon)
  const [deleteIcon] = useImage(DeleteIcon)
  const dispatch = useAppDispatch()
  const [createUpdateAnchor] = useCreateUpdateAnchorMutation()
  const { elementInfo } = useAppSelector(selectPageSlice)

  const [showSaveButton, setShowSaveButton] = useState(false)

  const handleDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const mousePos = getMousePos(stage)
    setNewAnchor({ x: mousePos[0], y: mousePos[1] })
    setShowSaveButton(false)
  }
  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const mousePos = getMousePos(stage)
    setNewAnchor({ x: mousePos[0], y: mousePos[1] })
    setShowSaveButton(true)
  }

  const adjustedRadius = (planIconSize - 4) / 2 / scale

  const onSaveAnchor = async () => {
    const anchorExternalId = localStorage.getItem('anchorExternalId')
    const anchorZIndex = localStorage.getItem('anchorZIndex')
    if (!currentFloorData) return
    try {
      const response = await createUpdateAnchor({
        id: null,
        externalId: anchorExternalId ?? '',
        x: newAnchor.x * (currentFloorData.planLongitude / 1000),
        y: newAnchor.y * (currentFloorData.planLatitude / 550),
        z: Number(anchorZIndex),
        buildingId: currentFloorData?.buildingId ?? 0,
        floorId: currentFloorData?.id ?? 0,
      }).unwrap()

      const prevFloorData = elementInfo.floor as FloorsWithDevicesType
      const updatedFloorData = {
        ...elementInfo.floor,
        anchors: [...prevFloorData.anchors, response],
      }

      dispatch(setIsOpenModal(false))
      dispatch(
        setIsOpenModal({
          isOpen: true,
          type: ModalTypes.createAnchorFloorPlan,
          id: elementInfo?.floor?.id ?? 0,
          name: 'edit',
          floor: updatedFloorData as FloorsWithDevicesType,
          building: elementInfo.building,
        }),
      )

      const successMessage = t('modalTitle.radioTagAddSuccess')

      dispatch(
        showNotificationSnackBar({
          type: 'success',
          message: successMessage,
        }),
      )
    } catch (error: unknown) {
      const errorMessage = t('modalTitle.radioTagAddError')

      dispatch(
        showNotificationSnackBar({
          type: 'error',
          message: errorMessage,
        }),
      )
    } finally {
      localStorage.removeItem('anchorExternalId')
      localStorage.removeItem('anchorZIndex')
      dispatch(setDrawAnchorFloor(false))
    }
  }

  const onRemoveAnchor = () => {
    localStorage.removeItem('anchorExternalId')
    localStorage.removeItem('anchorZIndex')
    setNewAnchor({ x: 0, y: 0 })
    dispatch(setDrawAnchorFloor(false))
  }

  useEffect(() => {
    if (newAnchor.x !== 0 && !showSaveButton) {
      setShowSaveButton(true)
    } else return
  }, [])

  return (
    <React.Fragment>
      <Circle
        x={newAnchor.x}
        y={newAnchor.y}
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
        x={newAnchor.x - adjustedRadius}
        y={newAnchor.y - adjustedRadius}
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
            x={newAnchor.x}
            y={newAnchor.y - adjustedRadius / scale - (30 / scale + 4)} // Position above the anchor
            onClick={() => {
              onSaveAnchor()
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
            x={newAnchor.x + 30 / scale + 0.7}
            y={newAnchor.y - adjustedRadius / scale - (30 / scale + 4)}
            onClick={() => {
              onRemoveAnchor()
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
              image={deleteIcon}
              fill={colors.bgDark}
            />
          </Group>
        </Group>
      )}
    </React.Fragment>
  )
}
