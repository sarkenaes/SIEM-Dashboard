import {useState, useEffect} from "react"
import {BarChart,Bar, XAxis, YAxis, Tooltip,ResponsiveContainer, PieChart,Pie, Cell,Legend} from "recharts"
function App(){
const [events, setEvents]=useState([])
const [filter,setFilter]=useState("all")
const [search, setSearch]=useState("")
const [alerts,setAlerts]=useState([])
const [page, setPage]= useState(0)
const pageSize= 10
useEffect(()=>{
const fetchData= () =>{
  fetch("http://localhost:5000/api/events")
  .then(res=>res.json())
  .then(data => setEvents(data.events))
  fetch ("http://localhost:5000/api/alerts")
   .then(res => res.json())
   .then(data => setAlerts(data.alerts || []))
 
}
fetchData()
const interval =setInterval(fetchData, 30000)
return () => clearInterval(interval)
},[])
const filtered =events 
  .filter( event => filter === "all" || event.severity === filter)
  .filter(event => event.source_ip && event.source_ip.includes(search))
const paginated= filtered.slice(page*pageSize,(page+1) *pageSize)
useEffect(() => {
  setPage(0)
}, [filter, search])
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
  <div style={{display:"flex", gap:"16px", marginBottom:"20px"}}>
  <div style={{background:"#1e293b", padding:"16px", borderRadius:"8px", flex:1, textAlign:"center"}}>
    <div style={{color:"#94a3b8", fontSize:"13px"}}>Total Events</div>
    <div style={{color:"white", fontSize:"28px", fontWeight:"bold"}}>{events.length}</div>
  </div>
  <div style={{background:"#1e293b", padding:"16px", borderRadius:"8px", flex:1, textAlign:"center"}}>
    <div style={{color:"#94a3b8", fontSize:"13px"}}>High Severity</div>
    <div style={{color:"#ef4444", fontSize:"28px", fontWeight:"bold"}}>
      {events.filter(e => e.severity === "high").length}
    </div>
  </div>
  <div style={{background:"#1e293b", padding:"16px", borderRadius:"8px", flex:1, textAlign:"center"}}>
    <div style={{color:"#94a3b8", fontSize:"13px"}}>Active Alerts</div>
    <div style={{color:"#f97316", fontSize:"28px", fontWeight:"bold"}}>{alerts.length}</div>
  </div>
  <div style={{background:"#1e293b", padding:"16px", borderRadius:"8px", flex:1, textAlign:"center"}}>
    <div style={{color:"#94a3b8", fontSize:"13px"}}>Unique IPs</div>
    <div style={{color:"#4f9cf9", fontSize:"28px", fontWeight:"bold"}}>
      {new Set(events.map(e => e.source_ip)).size}
    </div>
  </div>
</div>
  {alerts.length >0 && (
    <div style ={{background: "#7f1d1d", padding:"10px", marginBottom:"20px", borderRadius : "6px"}}>
      <h3 style ={{ color: "#fca5a5", margin: "0 0 8px 0"}}>🚨 Active Alerts ({alerts.length})</h3>
      {alerts.map(alert =>(
        <div key = {alert.id} style ={{color: "#fca5a5", marginBottom: "4px"}}>
          HIGH | {alert.source_ip }| {alert.message}
        </div>
      ))}
    </div>

  )}
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
  {paginated.map(event => (
    <tr key={event.id}>
      <td>{event.timestamp}</td>
      <td>
        {event.source_ip}
        {event.source_ip && (
          <button 
            onClick={() => {
              fetch(`http://localhost:5000/api/threat/${event.source_ip}`)
                .then(res => res.json())
                .then(data => alert(`IP: ${data.ip}\nAbuse Score: ${data.abuse_score}\nCountry: ${data.country}\nMalicious: ${data.is_malicious}`))
            }}
            style={{marginLeft: "8px", fontSize: "11px", cursor: "pointer"}}
          >🔍</button>
        )}
      </td>
      <td>{event.host}</td>
      <td style={{ 
        color: event.severity === "high" ? "red" : 
               event.severity === "medium" ? "orange" : 
               event.severity === "info" ? "green" : "white"
      }}>{event.severity}</td>
      <td>{event.message}</td>
    </tr>
  ))}
</tbody>
   </table>
   <div style={{display:"flex", gap:"10px", marginTop:"10px", alignItems:"center"}}>
  <button 
    onClick={() => setPage(p => p - 1)} 
    disabled={page === 0}
    style={{padding:"6px 12px", cursor:"pointer"}}
  >
    ← Previous
  </button>
  <span style={{color:"white"}}>
    Page {page + 1} of {Math.ceil(filtered.length / pageSize)}
  </span>
  <button 
    onClick={() => setPage(p => p + 1)} 
    disabled={(page + 1) * pageSize >= filtered.length}
    style={{padding:"6px 12px", cursor:"pointer"}}
  >
    Next →
  </button>
</div>
</div>)
}
export default App