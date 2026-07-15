import duckdb
import pandas as pd
from datetime import datetime
import os

DB_PATH = 'backend/sc_data.duckdb'
OUTPUT_DIR = 'backend/outputs'

def export_ai_usage_log():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    con = duckdb.connect(DB_PATH)
    try:
        query = """
        SELECT created_at as Waktu, role as Peran, action as Aksi, detail as Detail_Query, status as Status 
        FROM audit_log 
        WHERE action = 'RAG_SEARCH' 
        ORDER BY created_at DESC
        """
        df = con.execute(query).fetchdf()
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        excel_path = os.path.join(OUTPUT_DIR, f'Laporan_AI_Usage_Log_{timestamp}.xlsx')
        
        # Write to excel with formatting if possible
        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='AI Usage Log')
            workbook = writer.book
            worksheet = writer.sheets['AI Usage Log']
            for col in worksheet.columns:
                max_length = 0
                column = col[0].column_letter
                for cell in col:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(cell.value)
                    except:
                        pass
                adjusted_width = (max_length + 2)
                worksheet.column_dimensions[column].width = min(adjusted_width, 100)
                
        print(f"SUCCESS: Laporan berhasil diekspor ke: backend/outputs/{os.path.basename(excel_path)}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
    finally:
        con.close()

if __name__ == '__main__':
    export_ai_usage_log()
