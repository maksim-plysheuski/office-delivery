import React, {
  ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Konva from 'konva'
import { Stage, Layer, Image } from 'react-konva'
import { useAppSelector } from '@/shared/model'
import './PlanImage.css'
import { AnchorRender } from './layers/anchors/AnchorsRender'
import {
  AnchorsInBuildingType,
  FloorsWithDevicesType,
} from '@/shared/api/facilitiesApi'
import { DrawZone } from './layers/zones/DrawZone'
import { selectFloorSlice } from '../../model/slice'
import { ZoneRender } from './layers/zones/ZoneRender'
import { Grid } from './layers/grid/Grid'
import { DrawAnchor } from './layers/anchors/DrawAnchor'
import { ZonesToDisplayOnFloorType } from '../../lib/transformZonesToDisplay'
import { MoveAnchor } from './layers/anchors/MoveAnchor'
import { fileToDataURL } from '../../lib/fileToDataUrl'
import { zoomStage } from '../../lib/konva/zoomStage'
import { ZoomControls } from './layers/ZoomControls'
import { getMousePos } from '../../lib/konva/getMousePos'
import { MoveZone } from './layers/zones/MoveZone'
import { EmployeeRender } from './layers/EmployeeRender'

type PlanImageProps = {
  selectedImage: File | null
  anchorsFloor: AnchorsInBuildingType[] | undefined
  zonesFloor: ZonesToDisplayOnFloorType[]
  currentFloorData: FloorsWithDevicesType | undefined
  isViewFloorMode: boolean
  isEditFloorMode: boolean
  isGridVisible: boolean
  gridStep: number
}

export interface PlanImageState {
  value: Value
}
interface Translation {
  x: number
  y: number
}

interface Value {
  scale: number
  translation: Translation
}

export const PlanImage: React.FC<PlanImageProps> = ({
  selectedImage,
  anchorsFloor,
  zonesFloor,
  currentFloorData,
  isViewFloorMode,
  isEditFloorMode,
  isGridVisible,
  gridStep,
}) => {
  const imageRef: ComponentProps<typeof Image>['ref'] = useRef(null)
  const { drawZoneFloor, drawAnchorFloor, moveAnchorFloor, moveZoneFloor } =
    useAppSelector(selectFloorSlice)

  const videoElement = useMemo(() => {
    const element = new window.Image()
    element.width = 1000
    element.height = 550
    if (!selectedImage) return

    fileToDataURL(selectedImage)
      .then(dataURL => {
        element.src = dataURL
      })
      .catch(error => {
        console.error('Error converting file to data URL:', error)
      })

    return element
  }, [selectedImage])

  interface SizeState {
    width: number
    height: number
  }

  const [size, setSize] = useState<SizeState>({
    width: 1000,
    height: 550,
  })
  const [image, setImage] = useState<HTMLImageElement>()
  const [flattenedPoints, setFlattenedPoints] = useState<number[]>([])
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [points, setPoints] = useState<number[][]>([])
  const [isPolyComplete, setPolyComplete] = useState<boolean>(true)

  const stageRef = useRef<Konva.Stage>(null)

  const [scale, setScale] = useState<number>(1)
  const [stageX, setStageX] = useState<number>(1)
  const [stageY, setStageY] = useState<number>(1)
  const [newAnchor, setNewAnchor] = useState({ x: 0, y: 0 })
  const [movableAnchorData, setMovableAnchorData] =
    useState<AnchorsInBuildingType>({
      id: 0,
      externalId: '',
      x: 0,
      y: 0,
      z: 0,
    })

  const [movableZoneData, setMovableZoneData] =
    useState<ZonesToDisplayOnFloorType>({
      id: 0,
      name: '',
      initialHeight: 0,
      finalHeight: 0,
      points: [],
    })

  useEffect(() => {
    if (drawZoneFloor) {
      setPolyComplete(false)
    }
  }, [drawZoneFloor])

  useEffect(() => {
    if (!videoElement) return
    const onload = function () {
      setSize({
        width: videoElement.width,
        height: videoElement.height,
      })
      setImage(videoElement)
    }
    videoElement.addEventListener('load', onload)
    return () => {
      videoElement.removeEventListener('load', onload)
    }
  }, [videoElement])

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce<number[]>((a, b) => a.concat(b), []),
    )
  }, [points, isPolyComplete, position])

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) {
      // If it's not a left click, do nothing
      return
    }
    const stage = e.target.getStage()
    if (stage) {
      const mousePos = getMousePos(stage)
      if (drawAnchorFloor && newAnchor.x === 0) {
        setNewAnchor({ x: mousePos[0], y: mousePos[1] })
      }
      if (isPolyComplete && !drawZoneFloor) return
      if (drawZoneFloor) {
        setPoints([...points, mousePos])
      }
    } else throw new Error('Stage is null')
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const mousePos = getMousePos(stage)
    setPosition(mousePos)
  }

  const handlePointDragMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    if (!stage) {
      return
    }

    const mousePos = getMousePos(stage)
    if (!mousePos) {
      return
    }

    const index = e.target.index - 1
    const pos = [mousePos[0], mousePos[1]]
    if (pos[0] < 0) pos[0] = 0
    if (pos[1] < 0) pos[1] = 0
    if (pos[0] > stage.width() * scale) pos[0] = stage.width()
    if (pos[1] > stage.height() * scale) pos[1] = stage.height()

    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)])
  }

  const handleGroupDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target.name() === 'polygon') {
      const result: number[][] = []
      const copyPoints = [...points]
      copyPoints.map(point =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()]),
      )
      e.target.position({ x: 0, y: 0 }) //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result)
    }
  }

  type Position = { x: number; y: number }

  const boundFunc = (pos: Position) => {
    const x = Math.min(0, Math.max(pos.x, 1000 * (1 - scale)))
    const y = Math.min(0, Math.max(pos.y, 550 * (1 - scale)))
    return { x, y }
  }

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current
    if (!stage) return

    e.evt.preventDefault()
    const scaleBy = 1.02
    const oldScale = stage.scaleX()
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy

    const pointer = stage.getPointerPosition()
    if (pointer) {
      zoomStage(
        newScale,
        pointer,
        boundFunc,
        setScale,
        setStageX,
        setStageY,
        stageRef,
      )
    }
  }

  return (
    <>
      <Stage
        width={1000}
        height={550}
        scaleX={scale}
        scaleY={scale}
        x={stageX}
        y={stageY}
        draggable
        ref={stageRef}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        dragBoundFunc={boundFunc}
        // onDragMove={handleDragMove}
        className={
          drawZoneFloor
            ? 'custom-cursor-zone'
            : drawAnchorFloor && newAnchor.x === 0
              ? 'custom-cursor-anchor'
              : ''
        }
      >
        <Layer>
          <Image
            ref={imageRef}
            image={image}
            x={0}
            y={0}
            width={size.width}
            height={size.height}
          />
          {!isEditFloorMode && zonesFloor.length && !moveZoneFloor
            ? zonesFloor.map(zone => {
                return (
                  <ZoneRender
                    name={zone.name}
                    zone={zone}
                    flattenedPoints={zone.points}
                    scale={scale}
                    setPoints={setPoints}
                    setMovableZoneData={setMovableZoneData}
                    key={zone.name}
                  />
                )
              })
            : null}
          {!isEditFloorMode && anchorsFloor && anchorsFloor.length ? (
            <AnchorRender
              scale={scale}
              planIconSize={32}
              anchorsFloor={anchorsFloor}
              currentFloorData={currentFloorData}
              setMovableAnchorData={setMovableAnchorData}
            />
          ) : null}
          {isViewFloorMode ? (
            <EmployeeRender
              scale={scale}
              planIconSize={32}
              currentFloorData={currentFloorData}
            />
          ) : null}
          {!moveZoneFloor ? (
            <DrawZone
              points={points}
              scale={scale}
              flattenedPoints={flattenedPoints}
              currentFloorData={currentFloorData}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              isFinished={isPolyComplete}
              setPolyComplete={setPolyComplete}
              setPoints={setPoints}
            />
          ) : null}
          {drawAnchorFloor && newAnchor.x !== 0 ? (
            <DrawAnchor
              planIconSize={32}
              scale={scale}
              currentFloorData={currentFloorData}
              newAnchor={newAnchor}
              setNewAnchor={setNewAnchor}
            />
          ) : null}
          {moveZoneFloor ? (
            <MoveZone
              points={points}
              scale={scale}
              flattenedPoints={flattenedPoints}
              currentFloorData={currentFloorData}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              isFinished={isPolyComplete}
              setPolyComplete={setPolyComplete}
              setPoints={setPoints}
              movableZoneData={movableZoneData}
            />
          ) : null}
          {moveAnchorFloor && movableAnchorData.externalId !== '' ? (
            <MoveAnchor
              planIconSize={32}
              scale={scale}
              currentFloorData={currentFloorData}
              movableAnchorData={movableAnchorData}
              setMovableAnchorData={setMovableAnchorData}
            />
          ) : null}
          {isGridVisible ? (
            <Grid
              currentFloorData={currentFloorData}
              gridStep={gridStep}
              scale={scale}
            />
          ) : null}
        </Layer>
      </Stage>
      <ZoomControls
        boundFunc={boundFunc}
        setScale={setScale}
        setStageX={setStageX}
        setStageY={setStageY}
        stageRef={stageRef}
      />
    </>
  )
}

export default PlanImage
