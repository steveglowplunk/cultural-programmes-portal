
import { Button } from 'primereact/button'
import { useState } from 'react'


const EditUser = ({userId}:{userId: string}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  return (
    <>
      <Button
        label="Edit User"
        icon="pi pi-user-edit"
        className="mr-2 p-button-sm "
        severity="warning"
        onClick={() => {
          setIsEditDialogOpen(true)
        }}
      />
      
    </>
  )
}

export default EditUser