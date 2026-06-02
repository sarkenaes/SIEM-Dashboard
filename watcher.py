import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from watchdog.observers.polling import PollingObserver
from parser import parse_auth_line
from database import init_db, insert_event
Log_Path = "sample_auth.log"
class LogHandler(FileSystemEventHandler):
    def __init__(self):
        self.file =open(Log_Path, "r")
        self.file.seek(0,2)
    def on_modified(self, event):
        if event.src_path.endswith(Log_Path):
            for line in self.file:
                    result =parse_auth_line(line)
                    if result:
                        insert_event(result)
                        print(f"New event : {result['severity']} | {result['source_ip']}")
if __name__ == "__main__":
    init_db()
    handler = LogHandler()
    observer = PollingObserver()
    observer.schedule(handler, path=".", recursive=False)
    observer.start()
    print("Watching for new log entries...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()