
import { Button } from 'primereact/button'
import { useState } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog';
import axios from 'axios';

interface DeleteUserProps {
  userId: string;
  onDeleteSuccess: () => void;
}

const DeleteUser = ({ userId, onDeleteSuccess }: DeleteUserProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const handleDelete = async () => {
    try {
      await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + `/admin/users/${userId}`);
      setIsDeleteDialogOpen(false);
      onDeleteSuccess();
      // Optionally, you can add a callback to refresh the user list or show a success message
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Button
        label="Delete User"
        icon="pi pi-user-minus"
        className="mr-2 p-button-sm "
        severity="danger"
        onClick={() => {
          setIsDeleteDialogOpen(true)
        }}
      />

      <ConfirmDialog
        visible={isDeleteDialogOpen}
        onHide={() => setIsDeleteDialogOpen(false)}
        message="Are you sure you want to delete this user?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={handleDelete}
        reject={() => setIsDeleteDialogOpen(false)}
      />

    </>
  )
}

export default DeleteUser