import {useState, useEffect} from "react"
import {BarChart,Bar, XAxis, YAxis, Tooltip,ResponsiveContainer, PieChart,Pie, Cell,Legend} from "recharts"
function App(){
const [events, setEvents]=useState([])
const [filter,setFilter]=useState("all")
const [search, setSearch]=useState("")
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/events")
  .then(res => res.json())
  .then(data => setEvents(data.events))
},[])  
const filtered =events 
  .filter( event => filter === "all" || event.severity === filter)
  .filter(event => event.source_ip && event.source_ip.includes(search))
const severityCounts =[
  {name: "High",  count: events.filter(e=> e.severity === "high").length},
  {name: "Medium",  count: events.filter(e=> e.severity === "medium").length},
  {name: "Info",  count: events.filter(e=> e.severity === "info").length},
  {name: "Low",  count: events.filter(e=> e.severity === "low").length},
]
const COLORS ={
  High: "#ef4444",
  Medium: "#f97316",
  Info: "#22c55e",
  Low: "#94a3b8"
}
return (
<div style = {{padding : "20px", fontFamily: "monospace"}}>
  <h1>SIEM Dashboard</h1>
  <p>Total events: {events.length}</p>
  <ResponsiveContainer width ="100%" height ={200}>
    <BarChart data ={severityCounts}>
      <XAxis dataKey="name"/>
        <YAxis />
      <Tooltip/>
      <Bar dataKey ="count" fill ="#4f9cf9"/>      
    </BarChart>
  </ResponsiveContainer>
  <ResponsiveContainer width ="100%" height ={300}>
    <PieChart>
      <Pie
       data ={severityCounts}
        dataKey= "count"
        nameKey= "name"
        cx ="50%"
        cy="50%"
        outerRadius ={80}
        label>
          {severityCounts.map((entry,index)=>(
            <Cell key={index} fill ={COLORS[entry.name]}/>
          ))}
      </Pie>
        <Tooltip />
        <Legend />
    </PieChart>
  </ResponsiveContainer >
  <select onChange= {e=> setFilter(e.target.value)} style = {{marginBottom: "10px"}}>
    <option value="all">All</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="info">Info</option>
    <option value="low">Low</option>
  </select>
  <input type="text" placeholder="Search By IP"
  onChange={e=> setSearch(e.target.value)}
  style ={{marginBottom: "10px", marginLeft : "10px", padding: "4px"}}
  />
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