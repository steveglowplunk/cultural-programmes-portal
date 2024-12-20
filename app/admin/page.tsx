"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation"; // 使用 next/navigation 的 useRouter
import axios from "axios";
import withAuth from "../withAuth";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const AdminPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", location: "" });
  const [editEvent, setEditEvent] = useState<any>(null);
  const router = useRouter()
  const [displayDialog, setDisplayDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        console.log('response.data:', response.data)
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/data",
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData([...data, response.data]);
      setNewEvent({ name: "", date: "", location: "" });
      setDisplayDialog(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/data/${id}`,
        editEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(data.map((event) => (event.id === id ? response.data : event)));
      setEditEvent(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/data/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.filter((event) => event.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {/* 其他頁面內容 */}
      {/* Create New Event Dialog */}
      <Dialog header="Create New Event" visible={displayDialog} style={{ width: '50vw' }} onHide={() => setDisplayDialog(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText id="name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
          </div>
          <div className="p-field">
            <label htmlFor="date">Date</label>
            <Calendar id="date" value={newEvent.date ? new Date(newEvent.date) : undefined} onChange={(e) => setNewEvent({ ...newEvent, date: e.value === undefined || e.value === null ? "" : e.value.toString() })} />
          </div>
          <div className="p-field">
            <label htmlFor="location">Location</label>
            <InputText id="location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
          </div>
          <Button label="Create" icon="pi pi-check" onClick={handleCreate} />
        </div>
      </Dialog>
      {/* End of Dialog */}
      <div>
      <Button label="Create New Event" icon="pi pi-plus" onClick={() => setDisplayDialog(true)} />
        <h2>Create New Event</h2>
        <input
          type="text"
          placeholder="Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <div>
        <h2>Event List</h2>
        {data.map((event) => (
          <div key={event.id}>
            {editEvent && editEvent.id === event.id ? (
              <div>
                <input
                  type="text"
                  value={editEvent.name}
                  onChange={(e) => setEditEvent({ ...editEvent, name: e.target.value })}
                />
                <input
                  type="date"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                />
                <input
                  type="text"
                  value={editEvent.location}
                  onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                />
                <button onClick={() => handleUpdate(event.id)}>Save</button>
                <button onClick={() => setEditEvent(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{event.name}</p>
                <p>{event.date}</p>
                <p>{event.location}</p>
                <button onClick={() => setEditEvent(event)}>Edit</button>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

  );
};

export default withAuth(AdminPage, ["admin"]);
