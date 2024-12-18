import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import axios from "axios";

const EditUser = ({
  username,
  onEditSuccess,
}: {
  username: string;
  onEditSuccess: () => void;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetch user data when dialog opens
    if (isEditDialogOpen) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${username}`)
        .then((response) => {
          setEmail(response.data.email);
        })
        .catch((error) => {
          setError("Failed to fetch user data");
        });
    }
  }, [isEditDialogOpen, username]);

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${username}`,
        {
          email,
        }
      );
      if (response.status === 200) {
        onEditSuccess();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      setError("Failed to update user");
    }
  };

  return (
    <>
      <Button
        label="Edit User"
        icon="pi pi-user-edit"
        className="mr-2 p-button-sm"
        severity="warning"
        onClick={() => setIsEditDialogOpen(true)}
      />
      <Dialog
        header="Edit User"
        visible={isEditDialogOpen}
        onHide={() => setIsEditDialogOpen(false)}
      >
        <div>
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p>{error}</p>}
          <Button label="Save" onClick={handleEdit} />
        </div>
      </Dialog>
    </>
  );
};

export default EditUser;
