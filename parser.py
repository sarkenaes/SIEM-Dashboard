import re
def parse_auth_line(line):
        parts=line.split()
        month =parts[0]
        day =parts[1]
        time = parts[2]
        host = parts[3]
        message =" ".join(parts[5:])
        timestamp= f"{month} {day} {time}"
        severity ="low"
        if "Failed password" in message :
                severity ="high"
        elif "Invalid user in message":
            severity= "info"
        return{
               "timestamp" : timestamp,
               "host": host,
               "message": message,
               "severity": severity,
        }
line ="May 28 08:01:12 webserver sshd[1001] : Failed password for root from 198.51.100.5 port 22"
result = parse_auth_line(line)
print(result)