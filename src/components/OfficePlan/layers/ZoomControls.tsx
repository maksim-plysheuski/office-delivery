import { zoomStage } from '../../../lib/konva/zoomStage'
import '../PlanImage.css'
import { Stage } from 'konva/lib/Stage'
type Position = { x: number; y: number }

interface ZoomControlsProps {
  boundFunc: (pos: Position) => {
    x: number
    y: number
  }
  setScale: (value: React.SetStateAction<number>) => void
  setStageX: (value: React.SetStateAction<number>) => void
  setStageY: (value: React.SetStateAction<number>) => void
  stageRef: React.RefObject<Stage>
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  boundFunc,
  setScale,
  setStageX,
  setStageY,
  stageRef,
}) => {
  const handleZoomIn = () => {
    const stage = stageRef.current
    if (!stage) return

    const oldScale = stageRef.current.scaleX()
    const newScale = oldScale * 1.1

    const center = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    }
    zoomStage(
      newScale,
      center,
      boundFunc,
      setScale,
      setStageX,
      setStageY,
      stageRef,
    )
  }

  const handleZoomOut = () => {
    const stage = stageRef.current
    if (!stage) return

    const oldScale = stageRef.current.scaleX()
    const newScale = oldScale / 1.1

    const center = {
      x: stageRef.current.width() / 2,
      y: stageRef.current.height() / 2,
    }
    zoomStage(
      newScale,
      center,
      boundFunc,
      setScale,
      setStageX,
      setStageY,
      stageRef,
    )
  }

  return (
    <div className="custom-controls">
      <button className="zoomPlus" onClick={handleZoomIn}>
        +
      </button>
      <button className="zoomMinus" onClick={handleZoomOut}>
        -
      </button>
    </div>
  )
}
