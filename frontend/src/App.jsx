import {useState, useEffect} from "react"
function App(){
const [events, setEvents]=useState([])
const [filter,setFilter]=useState("all")
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/events")
  .then(res => res.json())
  .then(data => setEvents(data.events))
},[])  
const filtered =filter=== "all"
? events: events.filter(event => event.severity === filter)
return (
<div style = {{padding : "20px", fontFamily: "monospace"}}>
  <h1>SIEM Dashboard</h1>
  <p>Total events: {events.length}</p>
  <select onChange= {e=> setFilter(e.target.value)} style = {{marginBottom: "10px"}}>
    <option value="all">All</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="info">Info</option>
    <option value="low">Low</option>
  </select>
   <table border ="1" cellPadding ="8" style ={{width: "100%", borderCollapse : "collapse"}}>
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>Host</th>
        <th>Severity</th>
        <th>Source IP</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map(event =>(
        <tr key={event.id}>
        <td>{event.timestamp}</td>
        <td>{event.host}</td>
        <td style={{ 
  color: event.severity === "high" ? "red" : 
         event.severity === "medium" ? "orange" : 
         event.severity === "info" ? "green" : "white"
}}>{event.severity}</td>
        <td>{event.source_ip}</td>
        <td>{event.message}</td>
        </tr>
      ))}
    </tbody>
   </table>
</div>)
}
export default App