import { cn } from '~/lib/utils'
import { TableCell as Cell } from '~/components/ui/table-scroll'
const TableCell = ({
  children,
  className,
  isHighlighted,
}: {
  children?: React.ReactNode
  className?: string
  isHighlighted?: boolean
}) => {
  return (
    <Cell className={cn(className, isHighlighted && 'bg-accent', 'py-0')}>
      <div className={cn(children && 'cursor-pointer rounded-md border border-input p-2 text-center')}>
        {children}
      </div>
    </Cell>
  )
}

export default TableCell
