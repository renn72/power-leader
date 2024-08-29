const Board = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  console.log(comp)
  return <div>Board</div>
}

export default Board
