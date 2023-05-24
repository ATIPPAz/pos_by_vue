export interface IColumn {
  key: string
  label: string
  styleCol?: {
    style?: string
    type?: string
    buttonCustom?: ButtonCustom
    disabled?: boolean
  }
  size?: string
}
interface ButtonCustom {
  min: number
  max: number
}
export interface TableOption {
  pagination?: number
  rowNumber?: boolean
  actionLabel: string
}
export interface ButtonClick {
  row: any
  index: number
}
