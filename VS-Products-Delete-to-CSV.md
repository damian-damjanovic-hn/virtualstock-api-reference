###  Features

- Exports rows from a table named `products_delete` to a CSV file.
- Filters rows where:
    - `part_number` is not empty,
    - `account_id` is a valid integer,
    - `recordAction` equals `"DELETE"`.
- Saves the CSV in the same folder as the workbook.
- Names the file as `products_delete_{dateTime}.csv`.
- Displays a message box with the number of rows exported.

###  VBA Code:

```vba
Sub ExportProductsDeleteCSV()
    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim exportPath As String
    Dim fileName As String
    Dim fileNum As Integer
    Dim row As ListRow
    Dim partNumber As String
    Dim accountId As Variant
    Dim recordAction As String
    Dim exportCount As Long
    Dim line As String
    Dim currentDateTime As String

    On Error GoTo ErrorHandler

    ' Set workbook and worksheet properties
    Dim wb As Workbook
    Set wb = ThisWorkbook

    ' Check if worksheets exist
    If Not WorksheetExists("About") Then
        MsgBox "Worksheet 'About' does not exist.", vbExclamation, "Export Error"
        Exit Sub
    End If
    If Not WorksheetExists("Delete") Then
        MsgBox "Worksheet 'Delete' does not exist.", vbExclamation, "Export Error"
        Exit Sub
    End If

    ' Set worksheet and table
    Set ws = wb.Sheets("Delete")
    Set tbl = ws.ListObjects("products_delete")

    ' Check if table is empty
    If tbl.ListRows.Count = 0 Then
        MsgBox "The table is empty. No data to export.", vbExclamation, "Export Error"
        Exit Sub
    End If

    ' Prepare file path
    currentDateTime = Format(Now, "yyyymmdd_HHmmss")
    fileName = "products_delete_" & currentDateTime & ".csv"
    exportPath = wb.Path & "\" & fileName

    ' Open file for writing
    fileNum = FreeFile
    Open exportPath For Output As #fileNum

    ' Write header
    line = ""
    For i = 1 To tbl.ListColumns.Count
        line = line & tbl.ListColumns(i).Name
        If i < tbl.ListColumns.Count Then line = line & ","
    Next i
    Print #fileNum, line

    ' Loop through rows
    exportCount = 0
    For Each row In tbl.ListRows
        partNumber = Trim(row.Range(1, tbl.ListColumns("part_number").Index).Value)
        accountId = row.Range(1, tbl.ListColumns("account_id").Index).Value
        recordAction = Trim(UCase(row.Range(1, tbl.ListColumns("recordAction").Index).Value))

        If partNumber <> "" And IsNumeric(accountId) And recordAction = "DELETE" Then
            line = ""
            For i = 1 To tbl.ListColumns.Count
                line = line & row.Range(1, i).Value
                If i < tbl.ListColumns.Count Then line = line & ","
            Next i
            Print #fileNum, line
            exportCount = exportCount + 1
        End If
    Next row

    ' Close file
    Close #fileNum

    ' Show success message
    MsgBox exportCount & " row(s) exported to " & fileName, vbInformation, "Export Complete"
    Exit Sub
ErrorHandler:
    MsgBox "An error occurred: " & Err.Description, vbCritical, "Error"

End Sub

Function WorksheetExists(sheetName As String) As Boolean
    Dim ws As Worksheet
    On Error Resume Next
    Set ws = ThisWorkbook.Sheets(sheetName)
    WorksheetExists = Not ws Is Nothing
    On Error GoTo 0
End Function
```
