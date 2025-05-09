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

    Set ws = ThisWorkbook.Sheets(1) ' Adjust if needed
    Set tbl = ws.ListObjects("products_delete")

    currentDateTime = Format(Now, "yyyymmdd_HHmmss")
    fileName = "products_delete_" & currentDateTime & ".csv"
    exportPath = ThisWorkbook.Path & "\" & fileName

    fileNum = FreeFile
    Open exportPath For Output As #fileNum

    line = ""
    For i = 1 To tbl.ListColumns.Count
        line = line & tbl.ListColumns(i).Name
        If i < tbl.ListColumns.Count Then line = line & ","
    Next i
    Print #fileNum, line

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

    Close #fileNum

    MsgBox exportCount & " row(s) exported to " & fileName, vbInformation, "Export Complete"
End Sub

```
