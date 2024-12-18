
import { Button } from 'primereact/button'
import { useState } from 'react'
import  CreateUser  from './CreateUser'

const CreatePromoCodeButton = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  return (
    <>
      <Button
        label="Create User"
        icon="pi pi-user-plus"
        className="mr-2"
        onClick={() => {
          setIsCreateDialogOpen(true)
        }}
      />
      <CreateUser
        isDialogOpen={isCreateDialogOpen}
        setIsDialogOpen={setIsCreateDialogOpen}
      />
    </>
  )
}

export default CreatePromoCodeButton