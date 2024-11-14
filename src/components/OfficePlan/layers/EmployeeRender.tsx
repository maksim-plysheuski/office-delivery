import { FloorsType } from '@/shared/api/floorsApi'
import { Circle } from 'react-konva'
import React, { useEffect, useState } from 'react'
import { colors } from '@/shared/theme'
import { Client, Message } from '@stomp/stompjs'

interface EmployeeRenderProps {
  scale: number
  planIconSize: number
  currentFloorData: FloorsType | undefined
}

interface EmployeeOnFloorData {
  id: number
  x: number
  y: number
  z: number
}

interface EmployeeOnFloorPosMessage {
  employeeId: number
  x: number
  y: number
  z: number
}

export const EmployeeRender: React.FC<EmployeeRenderProps> = ({
  scale,
  planIconSize,
  currentFloorData,
}) => {
  const [employeesOnFloorData, setEmployeesOnFloorData] = useState<
    EmployeeOnFloorData[]
  >([])

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://10.3.1.200:8080/ws',
      reconnectDelay: 2000,
      heartbeatIncoming: 500,
      heartbeatOutgoing: 500,
      onConnect: () => {
        client.subscribe(
          `/topic/building/${currentFloorData?.buildingId}/floor/${currentFloorData?.id}`,
          (message: Message) => {
            const body: EmployeeOnFloorPosMessage = JSON.parse(message.body)
            setEmployeesOnFloorData(prevState => {
              const index = prevState.findIndex(
                employee => employee.id === body.employeeId,
              )

              if (index !== -1) {
                const updatedEmployees = [...prevState]
                updatedEmployees[index] = {
                  id: body.employeeId,
                  x: body.x,
                  y: body.y,
                  z: body.z,
                }
                return updatedEmployees
              } else {
                return [
                  ...prevState,
                  { id: body.employeeId, x: body.x, y: body.y, z: body.z },
                ]
              }
            })
          },
        )
      },
      onStompError: frame => {
        console.error('STOMP Error:', frame)
      },
    })

    client.activate()
    return () => {
      client.deactivate()
    }
  }, [])

  return employeesOnFloorData.map(employee => {
    if (!currentFloorData?.planLatitude) return null

    const xPos =
      (1000 / currentFloorData.planLongitude) * employee.x - 2 / scale
    const yPos = (550 / currentFloorData.planLatitude) * employee.y - 2 / scale

    const adjustedRadius = (planIconSize - 4) / 2 / scale

    return (
      <React.Fragment key={employee.id}>
        <Circle
          x={xPos}
          y={yPos}
          radius={adjustedRadius}
          fill={colors.warning}
          stroke="white"
          strokeWidth={2}
          strokeScaleEnabled={false}
        />
      </React.Fragment>
    )
  })
}
