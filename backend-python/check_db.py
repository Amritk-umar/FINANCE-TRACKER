import sqlite3

def view_reports():
    try:
        conn = sqlite3.connect('reports.db')
        cursor = conn.cursor()
        
        # This matches the columns you created in main.py
        cursor.execute("SELECT user_name, month, total_spent, top_category FROM monthly_reports")
        rows = cursor.fetchall()
        
        if not rows:
            print("\n--- SQL DATABASE IS EMPTY ---")
            print("Try downloading a PDF from your dashboard first to log data!")
        else:
            print("\n--- SQL DATABASE PREVIEW (Amlgo Labs Requirement) ---")
            for row in rows:
                print(f"User: {row[0]} | Month: {row[1]} | Total: ${row[2]:.2f} | Top Cat: {row[3]}")
        
        print("------------------------------------------------------\n")
        conn.close()
    except sqlite3.OperationalError:
        print("\n--- ERROR: reports.db not found ---")
        print("The database file is created only after you click 'Download PDF' at least once.")

if __name__ == "__main__":
    view_reports()