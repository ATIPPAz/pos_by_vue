export interface IColumn {
  key: string
  label: string
  styleCol?: {
    style?: string
    type?: string
    inputNumberProps?: InputNumberProps
    disabled?: boolean
    class?: string
  }
  size?: string
}
interface InputNumberProps {
  min: number
  max: number
}
export interface TableOption {
  pagination?: number
  rowNumber?: boolean
  actionLabel: string
}
export interface ButtonClick {
  data: any
  index: number
}
