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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/events",
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
  
  useEffect(() => {
    fetchData();
  }, []);
  

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/admin/events",
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/${id}`,
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
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update the state to remove the deleted event
      setData(data.filter((event) => event._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 style={{fontWeight: 'bold', fontSize: '2rem'}}>Admin Page</h1>
      {/* 其他頁面內容 */}
      {/* Create New Event Dialog */}
      {/* <Dialog header="Create New Event" visible={displayDialog} style={{ width: '50vw' }} onHide={() => setDisplayDialog(false)}>
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
      </Dialog> */}
      {/* End of Dialog */}
      <div style={{ marginBottom: '1rem',marginTop: '1rem' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Create New Event</h2>
        <input
          type="text"
          placeholder="Event ID"
          value={newEvent.eventId}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          style={{ marginBottom: '0.5rem' , marginTop: '1rem' }}
        />
        <Calendar
          type="date"
          placeholder="Date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          style={{ marginBottom: '0.5rem', marginRight: '0.5rem' , width: '150px' }}
        />
        <input
          type="text"
          placeholder="Location"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          style={{ marginBottom: '0.5rem' }}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <div>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Event List</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          <p style={{ flex: 1  }}>Event ID</p>
          <p style={{ flex: 1,marginLeft: '-5rem'}}>Location ID</p>
        </div>
        {data.map((event) => (
          <div key={event._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editEvent && editEvent._id === event._id ? (
              <div>
                <input
                  type="text"
                  placeholder="Event ID" 
                  value={editEvent.eventId}
                  onChange={(e) => setEditEvent({ ...editEvent, name: e.target.value })}
                />
                <Calendar
                  type="date"
                  placeholder="Date"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                  style={{ marginBottom: '0.5rem', marginRight: '0.5rem' , width: '100px', height: '30px' }} 
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={editEvent.location}
                  onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                />
                <button onClick={() => handleUpdate(event._id)}>Save</button>
                <button onClick={() => setEditEvent(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <p style={{ flex: 1 }}>{event.eventId}</p>
                <p style={{ flex: 1 }}>{event.venueId}</p>
                <div>
                  <button style={{ marginRight:'1rem' }} onClick={() => setEditEvent(event)}>Edit</button>
                  <button onClick={() => handleDelete(event._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>

  );
};

export default withAuth(AdminPage, ["admin"]);
