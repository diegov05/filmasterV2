import React, { FC } from 'react'

interface EditingBoxProps {
    handleToggleReviewing: () => void
}

const EditingBox: FC<EditingBoxProps> = () => {
    return (
        <div className='absolute bg-black/40 backdrop-blur-sm w-full h-full z-50'>
        </div>
    )
}

export { EditingBox };