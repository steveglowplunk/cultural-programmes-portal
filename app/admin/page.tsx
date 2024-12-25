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
  const [newEvent, setNewEvent] = useState({ name: "", predateE: "", venueId: "", eventId: "" });
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
      setNewEvent({ name: "", eventId: "", predateE: "", venueId: "" }); // Line 61
      fetchData();
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
      fetchData();
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
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="m-4">
      <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Admin Page</h1>
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
      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Create New Event</h2>
        <div className="flex items-center space-x-2">
          <InputText
            type="text"
            placeholder="Event ID"
            value={newEvent.eventId || ""}
            onChange={(e) => setNewEvent({ ...newEvent, eventId: e.target.value })}
            // style={{ marginBottom: '0.5rem' }}
          />
          {/* <Calendar
            value={newEvent.predateE ? new Date(newEvent.predateE) : null}
            onChange={(e) => setNewEvent({ ...newEvent, predateE: e.value?.toISOString as unknown as string || "" })}
            style={{ marginBottom: '0.5rem', marginRight: '0.5rem', width: '150px' }}
          /> */}
          <InputText
            type="text"
            placeholder="Date"
            value={newEvent.predateE || ""}
            onChange={(e) => setNewEvent({ ...newEvent, predateE: e.target.value })}
            // style={{ marginBottom: '0.5rem' }}
          />
          <InputText
            type="text"
            placeholder="Location"
            value={newEvent.venueId || ""}
            onChange={(e) => setNewEvent({ ...newEvent, venueId: e.target.value })}
            // style={{ marginBottom: '0.5rem' }}
          />
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>

      <div>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Event List</h2>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}> */}
          <div className="flex justify-between font-bold">
            <p style={{ flex: 1 }}>Event ID</p>
            <p className="flex-1">Name</p>
            <p className="flex-1">Date</p>
            <p style={{ flex: 1 }}>Location ID</p>
            <br className="w-44" />
          </div>
        {/* </div> */}
        {data.map((event) => (
          <div key={event._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editEvent && editEvent._id === event._id ? (
              <div>
                <InputText
                  type="text"
                  value={editEvent.eventId || ""}
                  onChange={(e) => setEditEvent({ ...editEvent, eventId: e.target.value })}
                />
                <InputText
                  type="text"
                  value={editEvent.titleE || ""}
                  onChange={(e) => setEditEvent({ ...editEvent, titleE: e.target.value })}
                />
                {/* <Calendar
                  value={editEvent.predateE ? new Date(editEvent.predateE) : null}
                  onChange={(e) => setEditEvent({ ...editEvent, predateE: e.value ? e.value.toISOString() : "" })}
                  style={{ marginBottom: '0.5rem', marginRight: '0.5rem', width: '150px' }}
                /> */}
                <InputText
                  type="text"
                  value={editEvent.predateE || ""}
                  onChange={(e) => setEditEvent({ ...editEvent, predateE: e.target.value })}
                />
                <InputText
                  type="text"
                  value={editEvent.venueId || ""}
                  onChange={(e) => setEditEvent({ ...editEvent, venueId: e.target.value })}
                />
                <Button style={{ marginRight: '1rem' }} onClick={() => handleUpdate(event._id)}>Save</Button>
                <Button onClick={() => setEditEvent(null)}>Cancel</Button>
              </div>
            ) : (
              <>
                <p style={{ flex: 1 }}>{event.eventId}</p>
                <p style={{ flex: 1 }}>{event.titleE}</p>
                <p style={{ flex: 1 }}>{event.predateE}</p>
                <p style={{ flex: 1 }}>{event.venueId}</p>
                <div>
                  <Button style={{ marginRight: '1rem' }} onClick={() => setEditEvent(event)}>Edit</Button>
                  <Button onClick={() => handleDelete(event._id)}>Delete</Button>
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
