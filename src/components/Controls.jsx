import React from 'react'

const Controls = ({reset}) => {
  return (
    <div className='flex pt-8 justify-center'>
        <button onClick={reset} className='p-2 border rounded bg-red-700'>Reset Game</button>
    </div>
  )
}

export default Controls